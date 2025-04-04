import { Flex } from "antd"
import { InteractiveGrid } from "../../components/grid"
import { useEffect, useMemo, useState } from "react"

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
        if (level === 0) setMatrix([[a[0] === b[0] ? 0 : 1]])

        // TODO
    }, [matrix])

    return (
        <Flex vertical gap={1} className="bg-gray-200 w-fit rounded-md overflow-hidden">
            <Flex gap={1}>
                <InteractiveGrid disabled={true} />
                {
                    a.split("").map(char => <InteractiveGrid text={char} />)
                }
            </Flex>
            {
                b.split("").map((char, idx) => {
                    return <Flex gap={1}>
                        <InteractiveGrid text={char} />

                        {/* computed values */}
                        {matrix[idx]?.map(value => <InteractiveGrid text={value.toString()} />)}


                        {/* empty grids */}
                        {Array(a.length - (idx < level ? level : 0)).fill(<InteractiveGrid />)}
                    </Flex>
                })
            }
        </Flex>
    )
}