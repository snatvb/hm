const HM = require('./HM')

const test = (name, cb) => {
  let compared = false
  cb((a, b) => {
    if (compared) {
      console.log(`× [Failed] ${name}`)
      console.log(`  ⤷  This test was did`)
      return
    }
    if (a !== b) {
      console.log(`× [Failed] ${name}`)
      console.log(`  ⤷  ${a} and ${b} in not identity`)
    } else {
      console.log(`✔ [Success] ${name}`)
    }
    compared = true
  })
}

const describe = (name, cb) => {
  console.log('\n------------------------------------')
  console.log(`${name}\n`)
  cb()
  console.log('------------------------------------\n')
}

describe('As Proxy (size: 2048)', () => {
  const data = HM.create(2048)
  data.foo = 'bar'
  data.bar = 'baz'

  test('Add foo -> "bar"', (comp) => {
    const str = 'bar'
    data.foo = str
    comp(data.foo, str)
  })

  test('Add bar -> "baz"', (comp) => {
    const str = 'baz'
    data.bar = str
    comp(data.bar, str)
  })

  test('Add baz -> 1 -> 2', (comp) => {
    data.baz = 1
    data.baz = 2
    comp(data.baz, 2)
  })

  test('Remove bar -> "baz" -> undefined', (comp) => {
    delete data.bar
    comp(data.bar, undefined)
  })
})

describe('As Proxy Collistion (size: 2)', () => {
  const data = HM.create(2)

  for (let i = 0; i < 15; i++) {
    const key = (i * 2).toString()
    test(`Set and get ${key}`, (comp) => {
      data[key] = key
      comp(data[key], key)
    })
  }
})
