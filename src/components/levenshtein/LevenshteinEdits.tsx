import { ReactNode } from "react"
import { Edit, EditTypeEnum } from "../../algorithms/levenshtein"

export const LevenshteinEdits = (props: { a: string, b: string, edits: Edit[] }) => {
    const { a, b, edits } = props

    const getVisualization = (edit: Edit): ReactNode => {
        const pre = b.substring(0, (edit.from ? edit.from.y : -1) + 1)
        const suf = a.substring(edit.to.x + 1)

        return <span>
            {pre}
            (
            {edit.deletion && <s className="text-red-500">{edit.deletion}</s>}
            {edit.insertion &&
                <span className={edit.type === EditTypeEnum.SUBSTITUTION ? "text-yellow-500" : "text-green-500"}>
                    +{edit.insertion}</span>
            }
            )
            {suf} → {pre}
            <span className={edit.type === EditTypeEnum.SUBSTITUTION ? "text-yellow-500" : "text-green-500"}>
                {edit.insertion}</span>
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