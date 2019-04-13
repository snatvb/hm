const MASK = 0xf0000000
const MASK2 = 0xf0000000

function hash(data, size) {
  const key = "" + data
  let result = 0
  let test = 0

  for (let i = 0; i < key.length; i++) {
    const code = key.charCodeAt(i)
    result = (result << 4) + code
    if ((test = result & MASK) != 0) {
      result = ((result ^ (test >> 24)) & (MASK2))
    }
  }

  return result % size
}

module.exports = hash
