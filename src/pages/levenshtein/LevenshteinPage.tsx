import { Button, Flex, Input, Switch, Typography } from "antd"
import { LevenshteinMatrix } from "./LevenshteinMatrix"
import { useEffect, useState } from "react"

export const LevenshteinPage = () => {
    const [strA, setStrA] = useState("SUNDAY")
    const [strB, setStrB] = useState("SATURDAY")
    const [compute, setCompute] = useState(false)
    const [showAllPaths, setShowAllPaths] = useState(false)


    useEffect(() => {
        setCompute(false)
    }, [strA, strB])

    return <div id='levenshtein-page'>
        <Typography.Title level={3}>
            Levenshtein Distance
        </Typography.Title>

        [Explain Levenshtein Distance]<br /><br />

        <Flex vertical gap={3} className="!mb-10">
            <Flex align="center" gap={5}>
                <div>From:</div>
                <div >
                    <Input value={strA} onChange={(e) => setStrA(e.target.value.toUpperCase())} />
                </div>
            </Flex>
            <Flex align="center" gap={5}>
                <div>To:</div>
                <div>
                    <Input value={strB} onChange={(e) => setStrB(e.target.value.toUpperCase())} />
                </div>
            </Flex>
            <div>
                <Button type="primary" onClick={() => setCompute(true)}>Compute</Button>
            </div>
        </Flex>

        <Flex align="center" gap={5} className="!pb-2">
            <Switch checked={showAllPaths} onChange={(checked) => setShowAllPaths(checked)} />
            <div className="mb-0.5">Show All Paths</div>
        </Flex>
        <LevenshteinMatrix a={strA} b={strB} compute={compute} showAllPaths={showAllPaths} />
    </div>
}

