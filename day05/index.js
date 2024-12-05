import fs from 'node:fs'

const data = fs.readFileSync('./inputs', 'utf8')
let [rules, updates] = data.split('\n\n')

rules = rules.split('\n').map((rule) => {
  return rule.split('|').map(rule => parseInt(rule))
})

updates = updates.split('\n').map((update) => {
  return update.split(',').map(update => parseInt(update))
})

const findRule = (rules, a, b) => {
  return rules.find((rule) => {
    return JSON.stringify(rule) == JSON.stringify([a, b])
  })
}

let total = 0
let errors = []

updates.forEach((update) => {
  let correct = true
  for (const [i, a] of update.entries()) {
    for (const [j, b] of update.entries()) {
      if (i === j || j < i) continue;
      const rule = findRule(rules, a, b)
      if (rule === undefined) {
        const exception = findRule(rules, b, a)
        if (exception !== undefined) {
          correct = false
        }
      }
    }
  }

  if (correct) {
    let middle = (update.length - 1) / 2
    total += update[middle]
  } else {
    errors.push(update)
  }
})

let errors_total = 0

errors.forEach((update) => {
  for (const [i, a] of update.entries()) {
    for (const [j, b] of update.entries()) {
      if (i === j) continue;
      const rule = findRule(rules, a, b)
      if (rule !== undefined && i > j) {
        let temp = update[i]
        update[i] = update[j]
        update[j] = temp
      }
    }
  }

  let middle = (update.length - 1) / 2
  errors_total += update[middle]
})

console.log('total: ', total)
console.log('total errors: ', errors_total)
