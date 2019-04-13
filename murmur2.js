const M = 0x5bd1e995
const SEED = 0
const R = 24

// VERY SLOW
function hash(data, size) {
  const key = "" + data
  let h = SEED ^ size
  let k
  let i = 0
  while (size >= 4) {
    k = key.charCodeAt(i)
    k |= key.charCodeAt(i + 1) << 8
    k |= key.charCodeAt(i + 2) << 16
    k |= key.charCodeAt(i + 3) << 24

    k *= M
    k ^= k >> R
    k *= M

    h *= M
    h ^= k

    i += 4
    size -= 4
  }

  switch (size) {
    case 3:
      h ^= key.charCodeAt(2) << 16
      break
    case 2:
      h ^= key.charCodeAt(1) << 8
      break
    case 1:
      h ^= key.charCodeAt(0)
      h *= M
      break
  }

  h ^= h >> 13
  h *= M
  h ^= h >> 15
  return h
}

module.exports = hash
