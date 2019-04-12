class ListItem {
  constructor(data, next = null) {
    this.next = next
    this.data = data
  }
}

class List {
  constructor() {
    this.count = 0
    this.item = null
  }

  get last() {
    let item = this.item
    if (!item) return null

    while (item.next !== null) {
      item = item.next
    }

    return item
  }

  add(data) {
    const item = new ListItem(data)
    const last = this.last

    if (last) {
      last.next = item
    } else {
      this.item = item
    }

    this.count++
    return item
  }

  includes(data) {
    let item = this.item
    if (!item) return false

    do {
      if (data === item.data) return true
    } while ((item = item.next) !== null)

    return false
  }



  find(predicate) {
    let item = this.item
    if (!item) return

    do {
      if (predicate(item.data)) return item.data
    } while ((item = item.next) !== null)
  }

  forEach(f) {
    let item = this.item
    if (!item) return

    do {
      f(item.data)
    } while ((item = item.next) !== null)
  }

  clear() {
    this.item = null
    this.count = 0
  }

  remove(data) {
    let item = this.item
    if (!this.item) return false

    if (this.item.data === data) {
      this.item = this.item.next
      this.count--
      return true
    }

    while (true) {
      const nextItem = item.next
      if (!nextItem) return false

      if (nextItem.data === data) {
        item.next = nextItem.next
        this.item = item
        this.count--
        return true
      }
      item = nextItem
    }
  }

  findAndRemove(predicate) {
    let item = this.item
    if (!item) return

    if (predicate(item.data)) {
      this.item = this.item.next
      this.count--
      return item.data
    }

    while (true) {
      const nextItem = item.next
      if (!nextItem) return

      if (predicate(nextItem.data)) {
        item.next = nextItem.next
        return nextItem.data
      }
      item = nextItem
    }
  }

  isEmpty() {
    return !(this.item instanceof ListItem)
  }
}


function hash(data, size) {
  const key = "" + data
  let result = 0
  for (let i = 0; i < key.length; i++) {
    const code = key.charCodeAt(i)
    result += code * (i + 1)
  }
  return result % size
}

function getInstance(hashmap) {
  if (hashmap === null || typeof hashmap !== "object") {
    return undefined
  }
  const instance = hashmap["__inst__"]
  if (!(instance instanceof HashMap)) {
    return undefined
  }
  return instance
}

class HashMap {
  constructor(size = 10) {
    this.size = size
    this.table = []
  }

  set(key, value) {
    const index = hash(key, this.size)
    if (this.table[index] === undefined) {
      this.table[index] = new List()
    }
    const ceil = this.table[index]
    const item = ceil.find((item) => item.key === key)
    if (item) {
      item.value = value
    } else {
      ceil.add({ key, value })
    }
  }

  get(key) {
    const index = hash(key, this.size)
    const ceil = this.table[index]

    if (!ceil) return
    const item = ceil.find((item) => item.key === key)
    if (!item) return
    return item.value
  }

  remove(key) {
    const index = hash(key, this.size)
    const ceil = this.table[index]
    if (!ceil) {
      return
    }

    const removed = ceil.findAndRemove((item) => item.key === key)
    if (ceil.isEmpty()) {
      delete this.table[index]
    }
    return removed
  }

  forEach(f) {
    for (let i = 0; i < this.table.length; i++) {
      const ceil = this.table[i]
      if (!ceil) {
        continue
      }
      ceil.forEach(f)
    }
  }

  entries() {
    let result = []
    this.forEach(({ key, value }) => result.push([key, value]))
    return result
  }

  keys() {
    let result = []
    this.forEach(({ key }) => result.push(key))
    return result
  }

  values() {
    let result = []
    this.forEach(({ value }) => result.push(value))
    return result
  }

  toString() {
    return "HashMap"
  }

  sizeof() {
    return this.size
  }

  static create(size) {
    const instance = new HashMap(size)
    const proxy = new Proxy(instance, {
      get(target, key) {
        if (key === "__inst__") { return instance }
        if (["toString", "sizeof"].includes(key)) {
          return (...args) => instance[key](...args)
        }
        return instance.get(key)
      },
      set(target, key, value) {
        instance.set(key, value)
        return true
      },
      deleteProperty(target, key) {
        return Boolean(instance.remove(key))
      }
    })
    return proxy
  }



  static entries(hashmap) {
    const instance = getInstance(hashmap)
    return instance ? instance.entries() : undefined
  }


  static keys(hashmap) {
    const instance = getInstance(hashmap)
    return instance ? instance.keys() : undefined
  }


  static values(hashmap) {
    const instance = getInstance(hashmap)
    return instance ? instance.values() : undefined
  }
}


const obj = HashMap.create()
obj.test = 1
delete obj.test
obj.c = "bar"
obj.cd = "bar"
obj.foo = "bar"
obj.baz = "bar"
obj.func = () => { }

console.dir(obj.c)
console.dir(HashMap.entries(obj))
console.dir(HashMap.keys(obj))
console.dir(HashMap.values(obj))
console.dir(obj.sizeof())