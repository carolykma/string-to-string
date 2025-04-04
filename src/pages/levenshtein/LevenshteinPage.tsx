import { Flex, Typography } from "antd"

const gridSize = 35
const strA = "BELGIUM"
const strB = "BULGARIA"

export const LevenshteinPage = () => {
    return <div id='levenshtein-page'>
        <Typography.Title level={3}>
            Levenshtein Distance
        </Typography.Title>

        [Explain Levenshtein Distance]<br /><br />

        String A: {strA}<br />
        String B: {strB}<br /><br />

        <Flex vertical gap={1} className="bg-gray-200 w-fit rounded-md overflow-hidden">
            <Flex gap={1}>
                {
                    ["", ...strA.split("")].map(char => <Grid text={char} />)
                }
            </Flex>
            {
                strB.split("").map(char => {
                    return <Flex gap={1}>
                        <Grid text={char} />
                        {Array(strA.length).fill(<Grid />)}
                    </Flex>
                })
            }
        </Flex>
    </div>
}

type GridProps = {
    text?: string
}
const Grid = (props: GridProps) => {
    const { text } = props

    return (
        <Flex align="center" justify="center"
            style={{
                width: gridSize,
                height: gridSize,
            }}
            className="cursor-pointer bg-white hover:bg-blue-100"
        >
            {text || " "}
        </Flex>
    )
}