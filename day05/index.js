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

  for (var i = 0; i < update.length - 1; i++) {
    for (var j = i + 1; j < update.length; j++) {
      if (!findRule(rules, update[i], update[j]) && findRule(rules, update[j], update[i])) {
        correct = false
        break;
      }
    }

    if (!correct) break;
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
  update.sort((a, b) => {
    const rule = findRule(rules, a, b)
    if (rule) return -1
  })

  let middle = (update.length - 1) / 2
  errors_total += update[middle]
})

console.log('total: ', total)
console.log('total errors: ', errors_total)

// 5268
// 5799
