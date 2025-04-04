import { Typography } from "antd"
import { LevenshteinMatrix } from "./LevenshteinMatrix"

const strA = "SUNDAY"
const strB = "SATURDAY"

export const LevenshteinPage = () => {
    return <div id='levenshtein-page'>
        <Typography.Title level={3}>
            Levenshtein Distance
        </Typography.Title>

        [Explain Levenshtein Distance]<br /><br />

        String A: {strA}<br />
        String B: {strB}<br /><br />

        <LevenshteinMatrix a={strA} b={strB} />
    </div>
}

