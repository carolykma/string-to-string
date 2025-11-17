import { ReactNode } from "react"
import { EditTypeEnum, LevenshteinEdit } from "../../algorithms/levenshtein"

export const LevenshteinEdits = (props: { a: string, b: string, edits: LevenshteinEdit[] }) => {
    const { a, b, edits } = props

    const getVisualization = (edit: LevenshteinEdit): ReactNode => {
        const { from, to, type, deletion, insertion } = edit;
        const pre = from && b.substring(0, from.y)
        const suf = a.substring(to.x)

        return <span>
            {pre}
            (
            {deletion && <s className="text-red-500">{deletion}</s>}
            {insertion &&
                <span className={type === EditTypeEnum.SUBSTITUTION ? "text-yellow-500" : "text-green-500"}>
                    +{insertion}</span>
            }
            )
            {suf} → {pre}
            <span className={type === EditTypeEnum.SUBSTITUTION ? "text-yellow-500" : "text-green-500"}>
                {insertion}</span>
            {suf}
            {(!pre && !suf && !insertion) && '[null]'}
        </span>
    }

    return <div id='list-of-edits' className="w-70">
        <div className="bg-white rounded-md p-2">
            <div className="font-bold underline">{a || '[null]'} → {b || '[null]'}</div>
            <div>List of Edits:</div>
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