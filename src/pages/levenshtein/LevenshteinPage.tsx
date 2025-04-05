import { Button, Flex, Input, Typography } from "antd"
import { LevenshteinMatrix } from "./LevenshteinMatrix"
import { useEffect, useState } from "react"

export const LevenshteinPage = () => {
    const [strA, setStrA] = useState("SUNDAY")
    const [strB, setStrB] = useState("SATURDAY")
    const [compute, setCompute] = useState(false)

    useEffect(() => {
        setCompute(false)
    }, [strA, strB])

    return <div id='levenshtein-page'>
        <Typography.Title level={3}>
            Levenshtein Distance
        </Typography.Title>

        [Explain Levenshtein Distance]<br /><br />

        <Flex vertical gap={3}>
            <Flex align="center" gap={5}>
                <div>String 1:</div>
                <div >
                    <Input value={strA} onChange={(e) => setStrA(e.target.value.toUpperCase())} />
                </div>
            </Flex>
            <Flex align="center" gap={5}>
                <div>String 2:</div>
                <div>
                    <Input value={strB} onChange={(e) => setStrB(e.target.value.toUpperCase())} />
                </div>
            </Flex>
            <div className="mb-10">
                <Button type="primary" onClick={() => setCompute(true)}>Compute</Button>
            </div>
        </Flex>


        <LevenshteinMatrix a={strA} b={strB} compute={compute} />
    </div>
}

