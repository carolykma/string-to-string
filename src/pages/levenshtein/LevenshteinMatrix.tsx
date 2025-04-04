import _ from "lodash"
import { Flex } from "antd"
import { InteractiveGrid } from "../../components/grid"
import { useEffect, useMemo, useState } from "react"

const getGridValue = (
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

type LevenshteinMatrixProps = {
    a: string
    b: string
}

export const LevenshteinMatrix = (props: LevenshteinMatrixProps) => {
    const { a, b } = props
    const [matrix, setMatrix] = useState<number[][]>([])

    // number of levels that have been computed
    const level = useMemo(() => matrix.length, [matrix])

    useEffect(() => {
        if (level >= a.length && level >= b.length) return

        const newMatrix = _.cloneDeep(matrix)
        if (level < a.length) {
            for (let y = 0; y < level; y++) {
                newMatrix[y].push(getGridValue(a, b, level, y, newMatrix))
            }
        }
        if (level < b.length) {
            newMatrix.push([])
            for (let x = 0; x <= Math.min(level, a.length - 1); x++) {
                newMatrix[level].push(getGridValue(a, b, x, level, newMatrix))
            }
        }
        setMatrix(newMatrix)
    }, [matrix])

    return (
        <Flex vertical gap={1} className="bg-gray-200 w-fit rounded-md overflow-hidden">
            <Flex gap={1}>
                <InteractiveGrid disabled={true} />
                {a.split("").map((char, idx) =>
                    <InteractiveGrid text={char} key={`a-${idx}`} />
                )}
            </Flex>
            {
                b.split("").map((char, idx) => {
                    return <Flex gap={1} key={`b-row-${idx}`}>
                        <InteractiveGrid text={char} key={`b-${idx}`} />

                        {/* computed values */}
                        {matrix[idx]?.map((value, idx2) =>
                            <InteractiveGrid text={value.toString()} key={`value-${idx}-${idx2}`} />
                        )}
                    </Flex>
                })
            }
        </Flex>
    )
}