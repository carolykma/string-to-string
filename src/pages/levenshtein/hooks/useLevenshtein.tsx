import _ from "lodash"
import { useEffect, useMemo, useState } from "react"

// types
export type Coordinates = {
    x: number
    y: number
}

// algorithm
const computeGridValue = (
    a: string,
    b: string,
    coordinates: Coordinates,
    currentMatrix: number[][]
) => {
    const { x, y } = coordinates;
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
            newMatrix[y][x] = computeGridValue(a, b, { x, y }, newMatrix)
        })

        // update state
        setMatrix(newMatrix)
    }

    const hasValue = (coordinates: Coordinates): boolean => {
        const { x, y } = coordinates
        return matrix[y]?.[x] !== undefined
    }

    const getPrevSteps = (coordinates: Coordinates): Coordinates[] => {
        if (!hasValue(coordinates)) return [];
        const { x, y } = coordinates;
        const allPrev = [
            { x: x - 1, y },
            { x, y: y - 1 },
            { x: x - 1, y: y - 1 },
        ].filter(hasValue)
        const min = _.min(allPrev.map(({ x, y }) => matrix[y][x]))
        return allPrev.filter(({ x, y }) => matrix[y][x] === min)
    }

    const getAllPrevSteps = (coordinates: Coordinates): Coordinates[] => {
        if (!hasValue(coordinates)) return [];

        const set = new Set<string>() // key: "x-y" for deduplication
        set.add('0-0'); // recursive call will stop when reaching 0-0
        const getPrevStepsRecursively = (coordinates: Coordinates) => {
            getPrevSteps(coordinates).forEach((grid) => {
                const key = `${grid.x}-${grid.y}`
                if (!set.has(key)) {
                    set.add(key)
                    getPrevStepsRecursively(grid)
                }
            })
        }

        getPrevStepsRecursively(coordinates)
        return Array.from(set).map(key => {
            const [x, y] = key.split('-')
            return { x: parseInt(x), y: parseInt(y) }
        })
    }

    useEffect(() => {
        setMatrix([])
    }, [a, b])

    return {
        matrix,
        level,
        hasNextLevel,
        computeNextLevel,
        getPrevSteps,
        getAllPrevSteps,
    }
}