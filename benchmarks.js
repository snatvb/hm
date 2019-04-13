const { performance } = require('perf_hooks')
const HM = require('./HM')
// const murmur2hash = require('./murmur2') // very slow
const fnv1aModHash = require('./FNV-1a-mod')
const fnv1aHash = require('./FNV-1a')
const pjwHash = require('./PJWHash')

const DIVIER = '--------------------------'

const SIZE = 0x7cff // Почти 32 000
const ITEMS_COUNT = 50000

console.log(`Items: ${ITEMS_COUNT}`)
console.log(`Hash table size: ${SIZE}`)
console.log(DIVIER)

const bench = (name, cb) => () => {
  const started = performance.now()
  cb()
  console.log(`${name}: ${(performance.now() - started).toFixed(3)}ms`)
}

// VERY SLOW
// const benchMurmur2 = () => {
//   const start = performance.now()
//   for (let i = 0; i < ITEMS_COUNT; i++) {
//     murmur2hash(i, SIZE)
//   }
//   console.log(`Murmur2: ${(performance.now() - start).toFixed(3)}ms`)
// }

const benchFNV1aMod = bench('FNV 1a mod', () => {
  for (let i = 0; i < ITEMS_COUNT; i++) {
    fnv1aModHash(i, SIZE)
  }
})

const benchFNV1a = bench('FNV 1a', () => {
  for (let i = 0; i < ITEMS_COUNT; i++) {
    fnv1aHash(i, SIZE)
  }
})

const benchPJWHash = bench('PJWHash', () => {
  for (let i = 0; i < ITEMS_COUNT; i++) {
    pjwHash(i, SIZE)
  }
})

const benchHM = bench('Hash map', () => {
  const data = HM.create(SIZE)
  for (let i = 0; i < ITEMS_COUNT; i++) {
    data[i] = i
  }
})

const benchOrigObject = bench('Original object', () => {
  const data = {}
  for (let i = 0; i < ITEMS_COUNT; i++) {
    data[i] = i
  }
})

const start = () => {
  // benchMurmur2() // Very slow
  benchFNV1a()
  benchFNV1aMod()
  benchPJWHash()
  console.log(DIVIER)
  benchHM()
  benchOrigObject()
}

start()
