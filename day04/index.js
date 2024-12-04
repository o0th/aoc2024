const fs = require('node:fs')
const data = fs.readFileSync('./inputs.txt', 'utf8');

var matrix = []

data.split('\n').forEach((row, i) => {
  row.split('').forEach((letter, j) => {
    if (matrix[i] === undefined) {
      matrix[i] = []
    }

    matrix[i][j] = letter
  })
})

const coordinates = [
  [[0, 0], [0, 1], [0, 2], [0, 3]],
  [[0, 0], [0, -1], [0, -2], [0, -3]],
  [[0, 0], [1, 0], [2, 0], [3, 0]],
  [[0, 0], [-1, 0], [-2, 0], [-3, 0]],
  [[0, 0], [1, 1], [2, 2], [3, 3]],
  [[0, 0], [-1, -1], [-2, -2], [-3, -3]],
  [[0, 0], [1, -1], [2, -2], [3, -3]],
  [[0, 0], [-1, 1], [-2, 2], [-3, 3]],
]


const validate = (matrix, ...args) => {
  for (const arg of args) {
    if (arg[0] < 0 || arg[0] >= matrix[0].length) {
      return false
    }

    if (arg[1] < 0 || arg[1] >= matrix.length) {
      return false
    }
  }

  return true;
}

let xmasCount = 0
let masCount = 0

matrix.forEach((row, i) => {
  row.forEach((letter, j) => {
    if (letter === 'X') {
      coordinates.forEach((coordinate) => {
        const xi = i + coordinate[0][0]
        const xj = j + coordinate[0][1]
        const mi = i + coordinate[1][0]
        const mj = j + coordinate[1][1]
        const ai = i + coordinate[2][0]
        const aj = j + coordinate[2][1]
        const si = i + coordinate[3][0]
        const sj = j + coordinate[3][1]

        if (validate(matrix, [xi, xj], [mi, mj], [ai, aj], [si, sj])) {
          if (
            matrix[xi][xj] === 'X' &&
            matrix[mi][mj] === 'M' &&
            matrix[ai][aj] === 'A' &&
            matrix[si][sj] === 'S'
          ) {
            xmasCount++
          }
        }
      })
    }

    if (letter === 'A') {
      const masCoordinates = [[0, 0], [-1, -1], [1, 1], [-1, 1], [1, -1]]
      const ci = i + masCoordinates[0][0]
      const cj = j + masCoordinates[0][1]
      const tli = i + masCoordinates[1][0]
      const tlj = j + masCoordinates[1][1]
      const bri = i + masCoordinates[2][0]
      const brj = j + masCoordinates[2][1]
      const tri = i + masCoordinates[3][0]
      const trj = j + masCoordinates[3][1]
      const bli = i + masCoordinates[4][0]
      const blj = j + masCoordinates[4][1]

      if (validate(matrix, [ci, cj], [tli, tlj], [bri, brj], [tri, trj], [bli, blj])) {
        if (
          matrix[ci][cj] === 'A' &&
          ((matrix[tli][tlj] === 'M' && matrix[bri][brj] === 'S') || (matrix[tli][tlj] === 'S' && matrix[bri][brj] === 'M')) &&
          ((matrix[tri][trj] === 'M' && matrix[bli][blj] === 'S') || (matrix[tri][trj] === 'S' && matrix[bli][blj] === 'M'))
        ) {
          masCount++
        }
      }
    }
  })
})


console.log('XMAS count: ', xmasCount)
console.log('MAS count: ', masCount)
