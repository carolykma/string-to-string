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

        const newMatrix = _.cloneDeep(matrix)

        // calculate one column to the right
        if (level < a.length) {
            for (let y = 0; y < Math.min(level, b.length); y++) {
                newMatrix[y].push(computeGridValue(a, b, level, y, newMatrix))
            }
        }
        // calculate one row to the bottom
        if (level < b.length) {
            newMatrix.push([])
            for (let x = 0; x <= Math.min(level, a.length - 1); x++) {
                newMatrix[level].push(computeGridValue(a, b, x, level, newMatrix))
            }
        }
        setMatrix(newMatrix)
    }

    useEffect(() => {
        setMatrix([])
    }, [a, b])

    return {
        matrix,
        level,
        hasNextLevel,
        computeNextLevel,
    }
}