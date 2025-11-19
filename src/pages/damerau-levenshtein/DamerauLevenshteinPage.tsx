import { Flex, Input, Typography } from "antd"
import { LevenshteinMatrix } from "../../components/levenshtein"
import { useState } from "react"

export const DamerauLevenshteinPage = () => {
    const [strA, setStrA] = useState("WORM")
    const [strB, setStrB] = useState("FROM")

    return <div id='levenshtein-page'>
        <Typography.Title level={3}>
            Damerau-Levenshtein Distance
        </Typography.Title>

        [Explain Damerau-Levenshtein Distance]<br /><br />

        <Flex vertical gap={3} className="!mb-6">
            <Flex align="center" justify="between" gap={5}>
                <div className="w-10">From:</div>
                <div>
                    <Input value={strA} onChange={(e) => setStrA(e.target.value.toUpperCase())} />
                </div>
            </Flex>
            <Flex align="center" justify="between" gap={5}>
                <div className="w-10">To:</div>
                <div>
                    <Input value={strB} onChange={(e) => setStrB(e.target.value.toUpperCase())} />
                </div>
            </Flex>
        </Flex>

        <LevenshteinMatrix a={strA} b={strB} compute={true} variation="damerau" />
    </div>
}

