import fs from 'node:fs'

const data = fs.readFileSync('./input', 'utf8')

const equations = data.split('\n').slice(0, -1)
let operators = ['*', '+']

let calibration = 0
for (const equation of equations) {
  const partials = equation.split(': ')
  const result = parseInt(equation.split(': ')[0])
  const members = partials[1].split(' ').map((partial) => parseInt(partial))
  const permutations = Math.pow(operators.length, members.length - 1)

  for (var permutation = 0; permutation < permutations; permutation++) {
    const binaryPermuation = (permutation >>> 0).toString(operators.length)
    const binaryPermuations = (permutations >>> 0).toString(operators.length)
    const binaryPermutationWithPadding = binaryPermuation.padStart(binaryPermuations.length - 1, '0')
    let total = members[0]
    for (var i = 0; i < binaryPermutationWithPadding.length; i++) {
      if (binaryPermutationWithPadding[i] === '0') {
        total += members[i + 1]
      } else {
        total *= members[i + 1]
      }
    }

    if (total === result) {
      calibration += total
      break
    }
  }
}

console.log(calibration)

calibration = 0
operators = ['*', '+', '||']
for (const equation of equations) {
  const partials = equation.split(': ')
  const result = parseInt(equation.split(': ')[0])
  const members = partials[1].split(' ').map((partial) => parseInt(partial))
  const permutations = Math.pow(operators.length, members.length - 1)
  for (var permutation = 0; permutation < permutations; permutation++) {
    const binaryPermuation = (permutation >>> 0).toString(operators.length)
    const binaryPermuations = (permutations >>> 0).toString(operators.length)
    const binaryPermutationWithPadding = binaryPermuation.padStart(binaryPermuations.length - 1, '0')
    let total = members[0]
    for (var i = 0; i < binaryPermutationWithPadding.length; i++) {
      if (binaryPermutationWithPadding[i] === '0') {
        total += members[i + 1]
      } else if (binaryPermutationWithPadding[i] === '1') {
        total *= members[i + 1]
      } else {
        total = parseInt(total.toString() + members[i + 1].toString())
      }
    }

    if (total === result) {
      calibration += total
      break
    }
  }
}

console.log(calibration)
