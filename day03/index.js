const fs = require('node:fs')
const data = fs.readFileSync('./input.txt', 'utf8');

const regex = /(mul\(([\d]{1,3}),([\d]{1,3})\)|do\(\)|don't\(\))/g

const results = data.matchAll(regex)

let execute = true
let sum = 0

for (const result of results) {
	if (result[0].startsWith('mul') && execute === true) {
		sum += parseInt(result[2]) * parseInt(result[3])
	}

	if (result[0] === 'do()') {
		execute = true
	}

	if (result[0] === 'don\'t()') {
		execute = false
	}
}

console.log('Sum: ', sum)
