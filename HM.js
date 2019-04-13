const hash = require('./PJWHash')
// Элемент связанного списка
class ListItem {
  constructor(data, next = null) {
    this.next = next
    this.data = data
  }
}

// Стрктура данных - связанный список
class List {
  constructor() {
    this.count = 0
    this.head = null
    this.last = null
  }

  add(data) {
    const item = new ListItem(data)
    const last = this.last

    if (last) {
      last.next = item
    } else {
      this.head = item
    }

    this.count++
    this.last = item
    return item
  }

  includes(data) {
    let item = this.head
    if (!item) return false

    do {
      if (data === item.data) return true
    } while ((item = item.next) !== null)

    return false
  }

  find(predicate) {
    let item = this.head
    if (!item) return

    do {
      if (predicate(item.data)) return item.data
    } while ((item = item.next) !== null)
  }

  forEach(f) {
    let item = this.head
    if (!item) return

    do {
      f(item.data)
    } while ((item = item.next) !== null)
  }

  clear() {
    this.head = null
    this.last = null
    this.count = 0
  }

  remove(data) {
    let item = this.head
    if (!this.head) return false

    if (this.head.data === data) {
      this.head = this.head.next
      this.count--
      return true
    }

    while (true) {
      const nextItem = item.next
      if (!nextItem) return false

      if (nextItem.data === data) {
        item.next = nextItem.next
        if (this.last === nextItem) {
          this.last = null
        }
        this.count--
        return true
      }
      item = nextItem
    }
  }

  findAndRemove(predicate) {
    let item = this.head
    if (!item) return

    if (predicate(item.data)) {
      this.head = this.head.next
      this.count--
      return item.data
    }

    while (true) {
      const nextItem = item.next
      if (!nextItem) return

      if (predicate(nextItem.data)) {
        item.next = nextItem.next
        if (this.last === nextItem) {
          this.last = null
        }
        this.count--
        return nextItem.data
      }
      item = nextItem
    }
  }

  isEmpty() {
    return !(this.head instanceof ListItem)
  }
}


// Получение экземпляра хэш-мап из proxy-обертки
function getInstance(hm) {
  if (hm === null || typeof hm !== "object") {
    return undefined
  }
  const instance = hm["__inst__"]
  if (!(instance instanceof HM)) {
    return undefined
  }
  return instance
}

class HM {
  // size - Размер хэш-таблицы (маленькое занчение, для провоцирвоания коллизий)
  constructor(size = 10) {
    this.size = size
    this.table = new Array(this.size) // хеш-таблица
  }

  // Сохранение значения по ключу
  set(key, value) {
    // Получение номера ячейки (преобразование ключа к числу)
    const index = hash(key, this.size)
    if (this.table[index] === undefined) {
      // Если ячейка была пуста, сначала нужно ее инициализирвоать,
      // положив туда связанный список
      this.table[index] = new List()
    }
    const ceil = this.table[index]
    // Попытка найти данные с таким ключем, если они есть, то данные необходимо заменить
    const item = ceil.find((item) => item[0] === key)
    if (item) {
      item[1] = value // Замена данных в существующем элементе
    } else {
      let element = new Array(2) // Иммитация работы в строгих языках
      element[0] = key
      element[1] = value
      ceil.add(element) // Добавление новых данных по ключу
    }
  }

  get(key) {
    // Получение номера ячейки (преобразование ключа к числу)
    const index = hash(key, this.size)
    const ceil = this.table[index]

    // Если ячейки нет, возвращается undefined
    if (!ceil) return undefined
    // Попытка найти данные по такому ключу в связанном списке
    const item = ceil.find((item) => item[0] === key)
    if (!item) return undefined
    return item[1]
  }

  remove(key) {
    // Получение номера ячейки (преобразование ключа к числу)
    const index = hash(key, this.size)
    const ceil = this.table[index]
    if (!ceil) {
      return
    }

    // Попытка найти данные по такому ключу и удалить их в связанном списке
    const removed = ceil.findAndRemove((item) => item[0] === key)
    // Если список пуст, то ячейка чищается
    // дабы не хранить в памяти экземпляр связанного списка
    // Но это не обязательно и можно этого не делать
    if (ceil.isEmpty()) {
      this.table[index] = undefined
    }
    // Удаленные данные
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

  // Получение массива из пар ключе занчение
  // [ [key, value], [key, value] ... ]
  entries() {
    let result = []
    this.forEach((item) => result.push(item))
    return result
  }

  keys() {
    let result = []
    this.forEach((item) => result.push(item[0]))
    return result
  }

  values() {
    let result = []
    this.forEach((item) => result.push(item[1]))
    return result
  }

  toString() {
    return "HM"
  }

  sizeof() {
    return this.size
  }

  // --- Статичные методы --- //

  // Создание данного хэш-мапа с прокси
  // чтобы использовать как обычный объект
  static create(size) {
    const instance = new HM(size)
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

  static entries(hm) {
    const instance = getInstance(hm)
    return instance ? instance.entries() : undefined
  }

  static keys(hm) {
    const instance = getInstance(hm)
    return instance ? instance.keys() : undefined
  }

  static values(hm) {
    const instance = getInstance(hm)
    return instance ? instance.values() : undefined
  }
}

module.exports = HM
