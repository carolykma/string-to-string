import _ from "lodash"
import { Flex } from "antd"
import { InteractiveGrid } from "../../components/grid"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Coordinates, useLevenshtein } from "./hooks/useLevenshtein"

type LevenshteinMatrixProps = {
    a: string
    b: string
    compute?: boolean
    showAllPaths?: boolean
}

export const LevenshteinMatrix = (props: LevenshteinMatrixProps) => {
    const { a, b, compute, showAllPaths } = props
    const { matrix, hasNextLevel, computeNextLevel, getAllPaths, getSinglePath } = useLevenshtein({ a, b })

    const [hovered, setHovered] = useState<Coordinates>()

    // for displaying min route(s)
    const allPaths = useMemo(() => hovered ? getAllPaths(hovered) : [], [hovered])
    const isAllPaths = useCallback(
        (coordinates: Coordinates) => allPaths.some((step) => _.isEqual(coordinates, step)),
        [getAllPaths]
    )
    const path = useMemo(() => hovered ? getSinglePath(hovered) : [], [hovered])
    const isPath = useCallback(
        (coordinates: Coordinates) => path.some((step) => _.isEqual(coordinates, step)),
        [path]
    )

    useEffect(() => {
        if (compute && hasNextLevel) computeNextLevel()
    }, [matrix, compute])

    return (
        <div>
            <Flex vertical gap={1}
                className="bg-gray-200 w-fit rounded-md overflow-hidden"
                onMouseLeave={() => setHovered(undefined)}
            >
                <Flex gap={1}>
                    <InteractiveGrid bg="#d9d9d9" />

                    {/* strA characters */}
                    {a.split("").map((char, idx) =>
                        <InteractiveGrid
                            text={char}
                            isHovered={hovered && hovered.x >= idx}
                            bg="#d9d9d9"
                            bgHovered="#8c8c8c"
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
                                isHovered={hovered && hovered.y >= idx}
                                bg="#d9d9d9"
                                bgHovered="#8c8c8c"
                                key={`b-${idx}`}
                            />

                            {/* computed values */}
                            {matrix[idx]?.map((value, idx2) =>
                                <InteractiveGrid
                                    text={value.toString()}
                                    setHovered={() => setHovered({ x: idx2, y: idx })}
                                    isHovered={showAllPaths ? isAllPaths({ x: idx2, y: idx }) : isPath({ x: idx2, y: idx })}
                                    bgHovered="#bae0ff"
                                    key={`value-${idx2}-${idx}`}
                                />
                            )}
                        </Flex>
                    })
                }
            </Flex>
        </div>
    )
}