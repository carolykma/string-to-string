import _ from "lodash"
import { Flex } from "antd"
import { InteractiveGrid } from "../grid"
import { useEffect, useRef, useState } from "react"
import { Levenshtein, Coordinates } from "../../algorithms/levenshtein"
import { LevenshteinEdits } from "."
import { useLevenshteinHover } from "./useLevenshteinHover"

type LevenshteinMatrixProps = {
    a: string
    b: string
    compute?: boolean
    variation?: 'base' | 'damerau'
}

export const LevenshteinMatrix = (props: LevenshteinMatrixProps) => {
    const { a, b, compute, variation = 'base' } = props
    const levenshtein = useRef<Levenshtein>(undefined)
    const [matrix, setMatrix] = useState<number[][]>([])
    const [hovered, setHovered] = useState<Coordinates>()
    const [locked, setLocked] = useState<boolean>(false)

    // for displaying min route(s)
    const { isSamplePath, isPossibleStep, samplePathEdits } = useLevenshteinHover(levenshtein, hovered)

    useEffect(() => {
        if (!a || !b || !compute) {
            setMatrix([])
            return
        }
        levenshtein.current = new Levenshtein(a, b, variation)
        setMatrix(levenshtein.current.getMatrixValues())
        setHovered({ x: a.length, y: b.length })
    }, [a, b, compute])

    return (
        <Flex id='levenshtein-matrix' gap={20} wrap="wrap">
            <Flex vertical gap={1}
                className="bg-gray-200 w-fit h-fit rounded-md  !shrink-0 relative"
                onMouseLeave={() => !locked && setHovered(undefined)}
            >
                <Flex gap={1}>
                    <InteractiveGrid bg="#d9d9d9" />

                    {/* strA characters */}
                    {`•${a}`.split("").map((char, idx) =>
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
                    `•${b}`.split("").map((char, idx) => {
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
                                    locked={locked}
                                    setLocked={setLocked}
                                    setHovered={() => setHovered({ x: idx2, y: idx })}
                                    isHovered={isPossibleStep({ x: idx2, y: idx })}
                                    bgHovered={isSamplePath({ x: idx2, y: idx }) ? "#69b1ff" : "#bae0ff"}
                                    key={`value-${idx2}-${idx}`}
                                />
                            )}
                        </Flex>
                    })
                }
                <img
                    src="icon/click.svg"
                    className="absolute -bottom-3 -right-3 opacity-25 
                        cursor-pointer hover:scale-[1.2] transition duration-500"
                />
            </Flex>
            {
                hovered && !!samplePathEdits?.length &&
                <LevenshteinEdits
                    a={a.substring(0, hovered.x)}
                    b={b.substring(0, hovered.y)}
                    edits={samplePathEdits}
                    isLocked={locked}
                    setLocked={setLocked}
                />
            }

        </Flex>
    )
}