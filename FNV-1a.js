const FNV_32_PRIME = 0x01000193

function hash(data, size) {
  const key = "" + data
  let result = 0x811c9dc5

  for (let i = 0; i < key.length; i++) {
    const code = key.charCodeAt(i)
    result ^= code
    result *= FNV_32_PRIME
  }

  return result % size
}

module.exports = hash
