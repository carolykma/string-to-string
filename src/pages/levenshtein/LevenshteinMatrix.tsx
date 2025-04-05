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
    compute?: boolean
}

export const LevenshteinMatrix = (props: LevenshteinMatrixProps) => {
    const { a, b, compute } = props
    const [matrix, setMatrix] = useState<number[][]>([])
    const [hovered, setHovered] = useState<{ x: number, y: number }>()

    // number of levels that have been computed
    const level = useMemo(() => Math.max(matrix.length, matrix[0]?.length || 0), [matrix])

    useEffect(() => {
        if (!compute) return
        if (level >= a.length && level >= b.length) return

        const newMatrix = _.cloneDeep(matrix)
        // calculate column of layer from top
        if (level < a.length) {
            for (let y = 0; y < Math.min(level, b.length); y++) {
                newMatrix[y].push(getGridValue(a, b, level, y, newMatrix))
            }
        }
        // calculate bottom row
        if (level < b.length) {
            newMatrix.push([])
            for (let x = 0; x <= Math.min(level, a.length - 1); x++) {
                newMatrix[level].push(getGridValue(a, b, x, level, newMatrix))
            }
        }
        setMatrix(newMatrix)
    }, [matrix, compute])

    useEffect(() => {
        setMatrix([])
    }, [a, b])

    return (
        <Flex vertical gap={1}
            className="bg-gray-200 w-fit rounded-md overflow-hidden"
            onMouseLeave={() => setHovered(undefined)}
        >
            <Flex gap={1}>
                <InteractiveGrid disabled={true} />

                {/* strA characters */}
                {a.split("").map((char, idx) =>
                    <InteractiveGrid
                        text={char}
                        active={hovered && hovered.x >= idx}
                        key={`a-${idx}`}
                    />
                )}
            </Flex>
            {
                b.split("").map((char, idx) => {
                    return <Flex gap={1} key={`b-row-${idx}`}>
                        {/* strB characters */}
                        <InteractiveGrid
                            text={char}
                            active={hovered && hovered.y >= idx}
                            key={`b-${idx}`}
                        />

                        {/* computed values */}
                        {matrix[idx]?.map((value, idx2) =>
                            <InteractiveGrid
                                text={value.toString()}
                                setHovered={() => setHovered({ x: idx2, y: idx })}
                                key={`value-${idx2}-${idx}`}
                            />
                        )}
                    </Flex>
                })
            }
        </Flex>
    )
}