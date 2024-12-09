import fs from 'node:fs'

const data = fs.readFileSync('./input', 'utf8')

const field = data.split('\n').slice(0, -1).map((row) => {
  return row.split('').map((col) => col)
})

const getFrequencies = (field) => {
  const frequencies = new Map()
  for (var i = 0; i < field[0].length; i++) {
    for (var j = 0; j < field.length; j++) {
      if (field[i][j].match(/[a-zA-Z0-9]/) !== null) {
        const key = field[i][j]
        const coordinates = frequencies.has(key)
          ? frequencies.get(key)
          : []
        coordinates.push([i, j])
        frequencies.set(key, coordinates)
      }
    }
  }

  return frequencies
}

const getAbsoluteDistance = (pointA, pointB) => {
  return [
    Math.abs(pointA[0] - pointB[0]),
    Math.abs(pointA[1] - pointB[1])
  ]
}

const getAntinodes = (pointA, pointB) => {
  const distance = getAbsoluteDistance(pointA, pointB)
  if (pointA[0] < pointB[0] && pointA[1] < pointB[1]) {
    return [
      [pointA[0] - distance[0], pointA[1] - distance[1]],
      [pointB[0] + distance[0], pointB[1] + distance[1]]
    ]
  }

  if (pointA[0] < pointB[0] && pointA[1] > pointB[1]) {
    return [
      [pointA[0] - distance[0], pointA[1] + distance[1]],
      [pointB[0] + distance[0], pointB[1] - distance[1]]
    ]
  }
}

const isValidPosition = (field, point) => {
  return (
    point[0] >= 0 &&
    point[0] < field[0].length &&
    point[1] >= 0 &&
    point[1] < field.length
  )
}

const getHarmonicAntinodes = (field, pointA, pointB) => {
  const distance = getAbsoluteDistance(pointA, pointB)
  let antinodes = []

  if (pointA[0] < pointB[0] && pointA[1] < pointB[1]) {
    let multiplier = 1
    let antinode = [
      pointA[0] - distance[0] * multiplier,
      pointA[1] - distance[1] * multiplier
    ]

    while (isValidPosition(field, antinode)) {
      antinodes.push(antinode)
      multiplier++
      antinode = [
        pointA[0] - distance[0] * multiplier,
        pointA[1] - distance[1] * multiplier
      ]
    }

    multiplier = 1
    antinode = [
      pointB[0] + distance[0] * multiplier,
      pointB[1] + distance[1] * multiplier
    ]
    while (isValidPosition(field, antinode)) {
      antinodes.push(antinode)
      multiplier++
      antinode = [
        pointB[0] + distance[0] * multiplier,
        pointB[1] + distance[1] * multiplier
      ]
    }
  }

  else if (pointA[0] < pointB[0] && pointA[1] > pointB[1]) {
    let multiplier = 1
    let antinode = [
      pointA[0] - distance[0] * multiplier,
      pointA[1] + distance[1] * multiplier
    ]

    while (isValidPosition(field, antinode)) {
      antinodes.push(antinode)
      multiplier++
      antinode = [
        pointA[0] - distance[0] * multiplier,
        pointA[1] + distance[1] * multiplier
      ]
    }

    multiplier = 1
    antinode = [
      pointB[0] + distance[0] * multiplier,
      pointB[1] - distance[1] * multiplier
    ]

    while (isValidPosition(field, antinode)) {
      antinodes.push(antinode)
      multiplier++
      antinode = [
        pointB[0] + distance[0] * multiplier,
        pointB[1] - distance[1] * multiplier
      ]
    }
  }

  return antinodes
}

let totalAntinodes = new Set()
const frequencies = getFrequencies(field)
frequencies.forEach((value) => {
  for (var i = 0; i < value.length - 1; i++) {
    for (var j = i + 1; j < value.length; j++) {
      const antinodes = getHarmonicAntinodes(field, value[i], value[j])
      for (const antinode of antinodes) {
        totalAntinodes.add(JSON.stringify(antinode))
        if (field[antinode[0]][antinode[1]] === '.') {
          field[antinode[0]][antinode[1]] = '#'
        }
      }
    }
  }
})

console.log(totalAntinodes.size)

let bullshit = 0
for (var i = 0; i < field[0].length; i++) {
  for (var j = 0; j < field.length; j++) {
    if (field[i][j] !== '.') bullshit++
  }
}

for (var i = 0; i < field[0].length; i++) {
  for (var j = 0; j < field.length; j++) {
    process.stdout.write(field[i][j])
  }
  process.stdout.write('\n')
}
process.stdout.write('\n')

console.log(bullshit)
//console.log(duplicates)
//console.log(totals)
