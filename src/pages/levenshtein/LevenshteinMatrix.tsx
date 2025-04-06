import _ from "lodash"
import { Flex } from "antd"
import { InteractiveGrid } from "../../components/grid"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Coordinates, useLevenshtein } from "./hooks/useLevenshtein"

type LevenshteinMatrixProps = {
    a: string
    b: string
    compute?: boolean
}

export const LevenshteinMatrix = (props: LevenshteinMatrixProps) => {
    const { a, b, compute } = props
    const { matrix, hasNextLevel, computeNextLevel, getAllPrevSteps } = useLevenshtein({ a, b })

    const [hovered, setHovered] = useState<Coordinates>()

    // for displaying min route
    const prevSteps = useMemo(() => hovered ? getAllPrevSteps(hovered) : [], [hovered])
    const isPrevStep = useCallback(
        (coordinates: Coordinates) => prevSteps.some((prevStep) => _.isEqual(coordinates, prevStep)),
        [prevSteps]
    )


    useEffect(() => {
        if (compute && hasNextLevel) computeNextLevel()
    }, [matrix, compute])

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
                                positive={isPrevStep({ x: idx2, y: idx })}
                                key={`value-${idx2}-${idx}`}
                            />
                        )}
                    </Flex>
                })
            }
        </Flex>
    )
}