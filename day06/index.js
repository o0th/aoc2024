import fs from 'node:fs'

const data = fs.readFileSync('./input', 'utf8')
const originalMatrix = data.split('\n').slice(0, -1).map((row) => {
  return row.split('').map((col) => {
    return col
  })
})

const getGuardPosition = (matrix) => {
  const guard = ['>', '<', '^', 'v']
  for (var i = 0; i < matrix[0].length; i++) {
    for (var j = 0; j < matrix.length; j++) {
      if (guard.includes(matrix[i][j])) {
        return [i, j]
      }
    }
  }

  return undefined
}

const printMatrix = (matrix) => {
  for (var i = 0; i < matrix[0].length; i++) {
    for (var j = 0; j < matrix.length; j++) {
      process.stdout.write(matrix[i][j])
    }
    process.stdout.write('\n')
  }

  process.stdout.write('\n')
}

const getValueAtPosition = (matrix, coordinates) => {
  return matrix[coordinates[0]][coordinates[1]]
}

const setValueAtPosition = (matrix, coordinates, value) => {
  matrix[coordinates[0]][coordinates[1]] = value
}

const isValidPosition = (matrix, coordinates) => {
  return (
    coordinates[0] < matrix[0].length &&
    coordinates[0] >= 0 &&
    coordinates[1] < matrix.length &&
    coordinates[1] >= 0
  )
}

const getGuardNextPosition = (currentPosition, currentState) => {
  const directions = {
    '^': [-1, 0],
    'v': [1, 0],
    '>': [0, 1],
    '<': [0, -1]
  }
  const nextPositionModifier = directions[currentState]

  const nextPosition = [
    currentPosition[0] + nextPositionModifier[0],
    currentPosition[1] + nextPositionModifier[1]
  ]

  return nextPosition
}

const changeGuardState = (currentState) => {
  if (currentState === '^') {
    return '>'
  }
  if (currentState === '>') {
    return 'v'
  }
  if (currentState === 'v') {
    return '<'
  }
  if (currentState === '<') {
    return '^'
  }
}

const countPass = (matrix) => {
  let count = 0
  for (var i = 0; i < matrix[0].length; i++) {
    for (var j = 0; j < matrix.length; j++) {
      if (matrix[i][j] === 'X') count++
    }
  }

  return count
}

const getPass = (matrix, coordinates) => {
  const pass = []
  for (var i = 0; i < matrix[0].length; i++) {
    for (var j = 0; j < matrix.length; j++) {
      if (matrix[i][j] === 'X' && !(i === coordinates[0] && j === coordinates[1])) {
        pass.push([i, j])
      }
    }
  }

  return pass
}


let matrix = JSON.parse(JSON.stringify(originalMatrix))

let guardOriginalPosition = getGuardPosition(matrix)
let guardPosition = getGuardPosition(matrix)
let guardState = getValueAtPosition(matrix, guardPosition)
let guardNextPosition = getGuardNextPosition(guardPosition, guardState)

while (isValidPosition(matrix, guardPosition)) {
  if (!isValidPosition(matrix, guardNextPosition)) {
    setValueAtPosition(matrix, guardPosition, 'X')
    break
  }

  if (getValueAtPosition(matrix, guardNextPosition) === '#') {
    guardState = changeGuardState(guardState)
    setValueAtPosition(matrix, guardPosition, guardState)
  } else {
    setValueAtPosition(matrix, guardPosition, 'X')
    setValueAtPosition(matrix, guardNextPosition, guardState)
    guardPosition = guardNextPosition
  }

  guardNextPosition = getGuardNextPosition(guardPosition, guardState)
}

console.log(countPass(matrix))

const passes = getPass(matrix, guardOriginalPosition)
let loops = 0

for (const pass of passes) {
  let iterations = 0
  matrix = JSON.parse(JSON.stringify(originalMatrix))
  setValueAtPosition(matrix, pass, '#')

  guardPosition = getGuardPosition(matrix)
  guardState = getValueAtPosition(matrix, guardPosition)
  guardNextPosition = getGuardNextPosition(guardPosition, guardState)

  let path = new Set()

  while (isValidPosition(matrix, guardPosition)) {
    if (!isValidPosition(matrix, guardNextPosition)) {
      setValueAtPosition(matrix, guardPosition, 'X')
      break
    }

    if (path.has(JSON.stringify(guardPosition))) {
      iterations++
      if (iterations > path.size) {
        loops++
        break;
      }
    }

    if (getValueAtPosition(matrix, guardNextPosition) === '#') {
      guardState = changeGuardState(guardState)
      setValueAtPosition(matrix, guardPosition, guardState)
    } else {
      setValueAtPosition(matrix, guardPosition, 'X')
      setValueAtPosition(matrix, guardNextPosition, guardState)
      path.add(JSON.stringify(guardPosition))
      guardPosition = guardNextPosition
    }

    guardNextPosition = getGuardNextPosition(guardPosition, guardState)
  }
}

console.log(loops)
