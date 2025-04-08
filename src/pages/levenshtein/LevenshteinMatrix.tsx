import _ from "lodash"
import { Flex } from "antd"
import { InteractiveGrid } from "../../components/grid"
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Levenshtein, Coordinates, Edit, EditTypeEnum } from "./algorithm/Levenshtein"

type LevenshteinMatrixProps = {
    a: string
    b: string
    compute?: boolean
}

export const LevenshteinMatrix = (props: LevenshteinMatrixProps) => {
    const { a, b, compute } = props
    const levenshtein = useRef<Levenshtein>(undefined)
    const [matrix, setMatrix] = useState<number[][]>([])
    const [hovered, setHovered] = useState<Coordinates>()

    // for displaying min route(s)
    const allPossibleSteps = useMemo(() => {
        if (!hovered || !levenshtein.current) return []
        return levenshtein.current.getAllPossibleStepsToTarget(hovered)
    }, [hovered])
    const samplePath = useMemo(() => {
        if (!hovered || !levenshtein.current) return []
        return levenshtein.current.getSinglePathToTarget(hovered)
    }, [hovered])
    const isPossibleStep = useCallback(
        (coordinates: Coordinates) => allPossibleSteps.some((step) => _.isEqual(coordinates, step)),
        [allPossibleSteps]
    )
    const isSamplePath = useCallback(
        (coordinates: Coordinates) => samplePath.some((step) => _.isEqual(coordinates, step)),
        [samplePath]
    )

    // for displaying edits
    const edits = useMemo(() => {
        if (!samplePath || !levenshtein.current) return
        return levenshtein.current.getListOfEditsFromPath(samplePath)
    }, [samplePath])

    useEffect(() => {
        if (!a || !b || !compute) {
            setMatrix([])
            return
        }
        levenshtein.current = new Levenshtein(a, b)
        setMatrix(levenshtein.current.getMatrixValues())
    }, [a, b, compute])

    return (
        <Flex id='levenshtein-matrix' gap={15}>
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
                                    isHovered={isPossibleStep({ x: idx2, y: idx })}
                                    bgHovered={isSamplePath({ x: idx2, y: idx }) ? "#69b1ff" : "#bae0ff"}
                                    key={`value-${idx2}-${idx}`}
                                />
                            )}
                        </Flex>
                    })
                }
            </Flex>
            {
                hovered && !!edits?.length &&
                <ListOfEdits
                    a={a.substring(0, hovered.x + 1)}
                    b={b.substring(0, hovered.y + 1)}
                    edits={edits}
                />
            }

        </Flex>
    )
}

const ListOfEdits = (props: { a: string, b: string, edits: Edit[] }) => {
    const { a, b, edits } = props

    const getVisualization = (edit: Edit): ReactNode => {
        const pre = b.substring(0, (edit.from ? edit.from.y : -1) + 1)
        const suf = a.substring(edit.to.x + 1)

        return <span>
            {pre}
            (
            {edit.deletion && <s className="text-red-500">{edit.deletion}</s>}
            {edit.insertion &&
                <span className={edit.type === EditTypeEnum.SUBSTITUTION ? "text-yellow-500" : "text-green-500"}>
                    +{edit.insertion}</span>
            }
            )
            {suf} → {pre}
            <span className={edit.type === EditTypeEnum.SUBSTITUTION ? "text-yellow-500" : "text-green-500"}>
                {edit.insertion}</span>
            {suf}
        </span>
    }

    return <div id='list-of-edits' className="w-70">
        <div>{a} → {b}</div>
        <div className="bg-white rounded-md p-2">
            <div>List of Edits:</div>
            <div>From: {a}</div>
            {
                edits
                    .filter(edit => edit.type !== EditTypeEnum.NULL)
                    .map((edit, idx) => {
                        return <div>{idx + 1}. {getVisualization(edit)}</div>
                    })
            }
        </div>
    </div>
}