import { ReactNode } from "react"
import { EditTypeEnum, LevenshteinEdit } from "../../algorithms/levenshtein";
import { DamerauLevenshteinEdit } from "../../algorithms/levenshtein/variations/damerau";

export const LevenshteinEdits = (props: { a: string, b: string, edits: LevenshteinEdit[] }) => {
    const { a, b, edits } = props

    const getVisualization = (edit: LevenshteinEdit | DamerauLevenshteinEdit): ReactNode => {
        const { from, to, type, deletion, insertion } = edit;
        const transposition = ('transposition' in edit && edit.transposition) || null
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
            {transposition &&
                <span className="text-purple-500">
                    {transposition[0]}↔{transposition[1]}</span>
            }
            )
            {suf} → {pre}
            <span className={type === EditTypeEnum.SUBSTITUTION ? "text-yellow-500" : "text-green-500"}>
                {insertion}
            </span>
            <span className="text-purple-500">
                {transposition?.[1]}{transposition?.[0]}
            </span>
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
                        return <div key={`edit-${idx}`}>{idx + 1}. {getVisualization(edit)}</div>
                    })
            }
        </div>
    </div>
}