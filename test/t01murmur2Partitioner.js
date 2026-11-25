/* global it, describe */
const assert = require('assert')
const murmur2Partitioner = require('../kafkaManager/murmur2Partitioner.js')

describe('murmur2Partitioner', function () {
  it('matches the Java client default partitioner', function () {
    const partitions = [0, 1, 2]
    const expected = { site1: 0, site2: 2, site3: 0, site4: 0, site5: 1, site6: 1 }
    for (const [key, partition] of Object.entries(expected)) {
      assert.equal(murmur2Partitioner(partitions, key), partition, key)
      assert.equal(murmur2Partitioner(partitions, Buffer.from(key)), partition, key)
    }
  })
})
