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

        <Flex vertical gap={3} className="!mb-6 w-[250px]">
            <Input
                addonBefore={<div className="w-[40px] text-left">From:</div>}
                value={strA}
                onChange={(e) => setStrA(e.target.value.toUpperCase())}
            />
            <Input
                addonBefore={<div className="w-[40px] text-left">To:</div>}
                value={strB}
                onChange={(e) => setStrB(e.target.value.toUpperCase())}
            />
        </Flex>

        <LevenshteinMatrix a={strA} b={strB} compute={true} variation="damerau" />
    </div>
}

