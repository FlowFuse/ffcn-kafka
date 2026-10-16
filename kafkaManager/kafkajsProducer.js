// Kafka 4.0 dropped the old protocol versions kafka-node uses to produce (KIP-896), so this
// wraps a kafkajs producer behind the kafka-node producer interface the Producer node expects
const EventEmitter = require('events')
const { Kafka, CompressionTypes, logLevel } = require('kafkajs')
const { DefaultPartitioner, RandomPartitioner, CyclicPartitioner } = require('kafka-node/lib/partitioner')
const murmur2Partitioner = require('./murmur2Partitioner.js')

// Kafka 4 still lists Produce v0 in ApiVersions but no longer the Fetch versions kafka-node knows
function brokerNeedsKafkajs (client) {
  return Object.values(client.brokers || {})
    .some(broker => broker.apiSupport && broker.apiSupport.fetch.min > broker.apiSupport.fetch.usable)
}

function getPartitioner (partitionerType) {
  if (partitionerType === 3) return murmur2Partitioner
  const PartitionerType = { 1: RandomPartitioner, 2: CyclicPartitioner }[partitionerType] || DefaultPartitioner
  const partitioner = new PartitionerType()
  return partitioner.getPartition.bind(partitioner)
}

class KafkajsProducer extends EventEmitter {
  constructor (client, options) {
    super()
    this.options = options
    const getPartition = getPartitioner(options.partitionerType)
    const kafka = new Kafka({
      brokers: client.options.kafkaHost.split(','),
      ssl: client.options.sslOptions || false,
      sasl: client.options.sasl,
      connectionTimeout: client.options.connectTimeout,
      requestTimeout: client.options.requestTimeout,
      logLevel: logLevel.WARN
    })
    this.producer = kafka.producer({
      createPartitioner: () => ({ partitionMetadata, message }) => {
        if (message.partition != null) return message.partition
        const partitions = partitionMetadata.map(metadata => metadata.partitionId).sort((a, b) => a - b)
        return getPartition(partitions, message.key)
      }
    })
    this.producer.connect().then(() => this.emit('ready'), error => this.emit('error', error))
  }

  send (payloads, callback) {
    Promise.all(payloads.map(payload => this.producer.send({
      topic: payload.topic,
      acks: this.options.requireAcks,
      timeout: this.options.ackTimeoutMs,
      compression: payload.attributes === 1 ? CompressionTypes.GZIP : CompressionTypes.None,
      messages: payload.messages.map(value => ({
        key: payload.key,
        value: typeof value === 'number' ? String(value) : value,
        partition: payload.partition
      }))
    }))).then(data => callback(null, data), error => callback(error))
  }

  close (callback) {
    this.producer.disconnect().then(() => callback(), callback)
  }
}

KafkajsProducer.brokerNeedsKafkajs = brokerNeedsKafkajs
module.exports = KafkajsProducer
