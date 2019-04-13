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

// VERY SLOW
// const benchMurmur2 = () => {
//   const start = performance.now()
//   for (let i = 0; i < ITEMS_COUNT; i++) {
//     murmur2hash(i, SIZE)
//   }
//   console.log(`Murmur2: ${(performance.now() - start).toFixed(3)}ms`)
// }

const benchFNV1aMod = () => {
  const start = performance.now()
  for (let i = 0; i < ITEMS_COUNT; i++) {
    fnv1aModHash(i, SIZE)
  }
  console.log(`FNV 1a mod: ${(performance.now() - start).toFixed(3)}ms`)
}

const benchFNV1a = () => {
  const start = performance.now()
  for (let i = 0; i < ITEMS_COUNT; i++) {
    fnv1aHash(i, SIZE)
  }
  console.log(`FNV 1a: ${(performance.now() - start).toFixed(3)}ms`)
}

const benchPJWHash = () => {
  const start = performance.now()
  for (let i = 0; i < ITEMS_COUNT; i++) {
    pjwHash(i, SIZE)
  }
  console.log(`PJWHash: ${(performance.now() - start).toFixed(3)}ms`)
}

const benchHM = () => {
  const data = HM.create(SIZE)
  const start = performance.now()
  for (let i = 0; i < ITEMS_COUNT; i++) {
    data[i] = i
  }
  console.log(`Hash map: ${(performance.now() - start).toFixed(3)}ms`)
}

const benchOrigObject = () => {
  const data = {}
  const start = performance.now()
  for (let i = 0; i < ITEMS_COUNT; i++) {
    data[i] = i
  }
  console.log(`Original object: ${(performance.now() - start).toFixed(3)}ms`)
}

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
