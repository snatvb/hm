const HM = require('./HM')

const test = (name, cb) => {
  cb((a, b) => {
    if (a !== b) {
      console.log(`× [Failed] ${name}`)
      console.log(`  ⤷  ${a} and ${b} in not identity`)
    } else {
      console.log(`✔ [Success] ${name}`)
    }
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

  test('Remove bar -> "baz" -> undefined', (comp) => {
    delete data.bar
    comp(data.bar, undefined)
  })
})
