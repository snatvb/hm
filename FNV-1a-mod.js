const HASH_PRIME = 0xff34c
function hash(data, size) {
  const key = "" + data
  let result = 0xcb
  for (let i = 0; i < key.length; i++) {
    const code = key.charCodeAt(i)
    result = result | code
    result = result * HASH_PRIME
  }
  return result % size
}

module.exports = hash
