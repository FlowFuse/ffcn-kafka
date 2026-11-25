// Same hash as the Java client's default partitioner, Utils.toPositive(Utils.murmur2(key)) % numPartitions,
// so a key lands on the same partition whichever client produced it
function murmur2 (data) {
  const length = data.length
  const m = 0x5bd1e995
  let h = 0x9747b28c ^ length
  const length4 = length & ~3
  for (let i = 0; i < length4; i += 4) {
    let k = data[i] | (data[i + 1] << 8) | (data[i + 2] << 16) | (data[i + 3] << 24)
    k = Math.imul(k, m)
    k ^= k >>> 24
    k = Math.imul(k, m)
    h = Math.imul(h, m) ^ k
  }
  switch (length & 3) {
    case 3: h ^= data[length4 + 2] << 16
    // falls through
    case 2: h ^= data[length4 + 1] << 8
    // falls through
    case 1:
      h ^= data[length4]
      h = Math.imul(h, m)
  }
  h ^= h >>> 13
  h = Math.imul(h, m)
  h ^= h >>> 15
  return h
}

function murmur2Partitioner (partitions, key) {
  const data = Buffer.isBuffer(key) ? key : Buffer.from(key == null ? '' : String(key))
  return (murmur2(data) & 0x7fffffff) % partitions.length
}

module.exports = murmur2Partitioner
