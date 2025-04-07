import _ from "lodash"
import { useEffect, useMemo, useState } from "react"

// types
export type Coordinates = {
    x: number
    y: number
}

export type Edit = {
    description: string,
    from: 'top-left' | 'top' | 'left'
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

    const getValue = (coordinates: Coordinates): number => {
        const { x, y } = coordinates
        const value = matrix?.[y]?.[x]
        if (value === undefined) throw new Error(`no value for grid ${x}-${y}`)
        return value
    }

    const getPrevStepCandidates = (coordinates: Coordinates): Coordinates[] => {
        const { x, y } = coordinates;
        return [
            { x: x - 1, y: y - 1 }, // top-left
            { x: x - 1, y }, // left
            { x, y: y - 1 }, // top
        ].filter(hasValue)
    }

    const getPrevSteps = (coordinates: Coordinates): Coordinates[] => {
        if (!hasValue(coordinates)) return [];
        const allCandidates = getPrevStepCandidates(coordinates)

        const { x, y } = coordinates
        const currentValue = getValue(coordinates)
        return allCandidates.filter((candidate, idx) => {
            const value = getValue(candidate)
            if (idx === 0 && a[x] === b[y]) {
                // top-left and last string equal
                return value === currentValue
            } else {
                return value === currentValue - 1
            }
        })
    }

    const getAllPaths = (coordinates: Coordinates): Coordinates[] => {
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
        set.add(`${coordinates.x}-${coordinates.y}`)
        return Array.from(set).map(key => {
            const [x, y] = key.split('-')
            return { x: parseInt(x), y: parseInt(y) }
        })
    }

    const getSinglePath = (coordinates: Coordinates): Coordinates[] => {
        const path = [coordinates];
        const getPrevStepRecursively = (coordinates: Coordinates) => {
            const prev = getPrevSteps(coordinates)[0]
            if (prev) {
                path.unshift(prev)
                getPrevStepRecursively(prev)
            }
        }
        getPrevStepRecursively(coordinates)
        return path;
    }

    const getEditFromPrevStep = (cur: Coordinates, prev: Coordinates): Edit => {
        const { x, y } = cur
        if (_.isEqual(prev, { x: x - 1, y: y - 1 })) {
            return {
                from: 'top-left',
                description: a[x] === b[y] ? "no edit" : `${a[x]} → ${b[y]}`,
            }
        } else if (_.isEqual(prev, { x, y: y - 1 })) {
            return {
                from: 'top',
                description: `+ ${b[y]}`,
            }
        } else if (_.isEqual(prev, { x: x - 1, y })) {
            return {
                from: 'left',
                description: `- ${a[x]}`
            }
        } else {
            throw new Error('invalid coordinates for getEditFromPrevStep')
        }
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
        getAllPaths,
        getSinglePath,
        getEditFromPrevStep,
    }
}