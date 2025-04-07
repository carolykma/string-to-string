import _ from "lodash"
import { Flex } from "antd"
import { InteractiveGrid } from "../../components/grid"
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import { Coordinates, Edit, EditTypeEnum, useLevenshtein } from "./hooks/useLevenshtein"

type LevenshteinMatrixProps = {
    a: string
    b: string
    compute?: boolean
}

export const LevenshteinMatrix = (props: LevenshteinMatrixProps) => {
    const { a, b, compute } = props
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
                                    isHovered={isAllPaths({ x: idx2, y: idx })}
                                    bgHovered={isPath({ x: idx2, y: idx }) ? "#69b1ff" : "#bae0ff"}
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
        const { x, y } = edit.to;
        const pre = b.substring(0, edit.from.y + 1)
        const suf = a.substring(edit.to.x + 1)

        let middle: ReactNode;
        switch (edit.type) {
            case EditTypeEnum.SUBSTITUTION:
                middle = <span>
                    (
                    <s className="text-red-500">{a[x]}</s>
                    <span className="text-yellow-500">+{b[y]}</span>
                    )
                </span>
                break;
            case EditTypeEnum.INSERTION:
                middle = <span>
                    (<span className="text-green-500">+{b[y]}</span>)
                </span>
                break;
            case EditTypeEnum.DELETION:
                middle = <span>
                    (<s className="text-red-500">{a[x]}</s>)
                </span>
                break;
            default:
                break;
        }

        return <span>
            {pre}{middle}{suf} → {pre}
            <span className={edit.type === EditTypeEnum.SUBSTITUTION ? "text-yellow-500" : "text-green-500"}>
                {edit.type === EditTypeEnum.DELETION ? "" : b[y]}
            </span>
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