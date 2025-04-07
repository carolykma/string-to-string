import _ from "lodash"
import { Flex } from "antd"
import { InteractiveGrid } from "../../components/grid"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Coordinates, Edit, EditTypeEnum, useLevenshtein } from "./hooks/useLevenshtein"

type LevenshteinMatrixProps = {
    a: string
    b: string
    compute?: boolean
    showAllPaths?: boolean
}

export const LevenshteinMatrix = (props: LevenshteinMatrixProps) => {
    const { a, b, compute, showAllPaths } = props
    const { matrix, hasNextLevel, computeNextLevel, getAllPaths, getSinglePath, getEditsFromPath } = useLevenshtein({ a, b })

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

    // for displaying edits
    const edits = useMemo(() => {
        if (!path || !getEditsFromPath) return
        return getEditsFromPath(path)
    }, [path, getEditsFromPath])

    useEffect(() => {
        if (compute && hasNextLevel) computeNextLevel()
    }, [matrix, compute])

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
                                    isHovered={showAllPaths ? isAllPaths({ x: idx2, y: idx }) : isPath({ x: idx2, y: idx })}
                                    bgHovered="#bae0ff"
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

    const getDescription = (edit: Edit) => {
        const { x, y } = edit.to;
        switch (edit.type) {
            case EditTypeEnum.NULL:
                return "no edit";
            case EditTypeEnum.SUBSTITUTION:
                return `${a[x]} → ${b[y]}`;
            case EditTypeEnum.INSERTION:
                return `+ ${b[y]}`;
            case EditTypeEnum.DELETION:
                return `- ${a[x]}`
        }
    }

    return <div id='list-of-edits' className="w-50">
        <div>{a} → {b}</div>
        <div className="bg-white rounded-md p-2">
            <div>List of Edits:</div>
            {
                edits
                    .filter(edit => edit.type !== EditTypeEnum.NULL)
                    .map((edit, idx) => {
                        return <div>{idx + 1}. {getDescription(edit)}</div>
                    })
            }
        </div>
    </div>
}