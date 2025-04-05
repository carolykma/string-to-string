import _ from "lodash"
import { useEffect, useMemo, useState } from "react"

// algorithm
const computeGridValue = (
    a: string,
    b: string,
    x: number,
    y: number,
    currentMatrix: number[][]
) => {
    if (x === 0 && y === 0) return a[0] === b[0] ? 0 : 1 // initial

    const candidates = []
    const charA = a[x]
    const charB = b[y]
    if (x > 0 && y > 0) candidates.push(currentMatrix[y - 1][x - 1] + (charA === charB ? 0 : 1))
    if (x > 0) candidates.push(currentMatrix[y][x - 1] + 1)
    if (y > 0) candidates.push(currentMatrix[y - 1][x] + 1)
    return _.min(candidates) || 0
}

export const useLevenshtein = (props: { a: string, b: string }) => {
    const { a, b } = props
    const [matrix, setMatrix] = useState<number[][]>([])

    // number of levels that have been computed
    const level = useMemo(() => Math.max(matrix.length, matrix[0]?.length || 0), [matrix])
    const hasNextLevel = useMemo(() => level < a.length || level < b.length, [a, b, level])

    const computeNextLevel = () => {
        if (!hasNextLevel) return

        // clone matrix (to avoid too many state updates)
        const newMatrix = _.cloneDeep(matrix)

        /*
            New level will add:             x x         x x n
            - 1 column to the right         x x    ->   x x n
            - 1 row to the bottom                       n n n
        */
        const coordinates: { x: number, y: number }[] = []
        for (let y = 0; y < level; y++) coordinates.push({ x: level, y })
        for (let x = 0; x <= level; x++) coordinates.push({ x, y: level })

        // calculate new value for each grid
        coordinates.forEach(({ x, y }) => {
            if (x >= a.length || y >= b.length) return
            if (!newMatrix[y]) newMatrix[y] = []
            newMatrix[y][x] = computeGridValue(a, b, x, y, newMatrix)
        })

        // update state
        setMatrix(newMatrix)
    }

    const getPrevMinCoordinates = (x: number, y: number) => {
        if (matrix[y]?.[x] === undefined) return [];
        const allPrev = [
            { x: x - 1, y },
            { x, y: y - 1 },
            { x: x - 1, y: y - 1 },
        ].filter(({ x, y }) => matrix[y]?.[x] !== undefined)
        const min = _.min(allPrev.map(({ x, y }) => matrix[y][x]))
        return allPrev.filter(({ x, y }) => matrix[y][x] === min)
    }

    useEffect(() => {
        setMatrix([])
    }, [a, b])

    return {
        matrix,
        level,
        hasNextLevel,
        computeNextLevel,
        getPrevMinCoordinates,
    }
}