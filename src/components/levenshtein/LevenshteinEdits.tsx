import { ReactNode } from "react"
import { EditTypeEnum, LevenshteinEdit } from "../../algorithms/levenshtein";
import { DamerauLevenshteinEdit } from "../../algorithms/levenshtein/variations/damerau";
import { Button, Flex, List, Tag } from "antd";
import { LockFilled } from "@ant-design/icons";

type LevenshteinEditsProps = {
    a: string,
    b: string,
    edits: LevenshteinEdit[],
    isLocked?: boolean,
    setLocked?: (value: boolean) => void
}

export const LevenshteinEdits = (props: LevenshteinEditsProps) => {
    const { a, b, edits, isLocked, setLocked } = props

    const getVisualization = (edit: LevenshteinEdit | DamerauLevenshteinEdit): ReactNode => {
        const { from, to, type, deletion, insertion } = edit;
        const transposition = ('transposition' in edit && edit.transposition) || null
        const pre = from && b.substring(0, from.y)
        const suf = a.substring(to.x)

        return <Flex>
            {pre}
            {deletion && <s className="text-red-500">{deletion}</s>}
            {transposition &&
                <span className="text-purple-500">
                    {transposition[0]}↔{transposition[1]}</span>
            }
            {type === EditTypeEnum.INSERTION && <div className="text-green-500 text-[20px] -mb-5">▴</div>}
            {suf}

            <div className="mx-1">→</div>

            {pre}
            <span className="text-green-500">{insertion}</span>
            <span className="text-purple-500">
                {transposition?.[1]}{transposition?.[0]}
            </span>
            {suf}
            {(!pre && !suf && !insertion && !transposition) && '[null]'}
        </Flex>
    }

    return <div id='list-of-edits' className="min-w-100">
        <div className="bg-white rounded-md">

            <List
                size="small"
                dataSource={edits.filter(edit => edit.type !== EditTypeEnum.NULL)}
                header={
                    <div className="font-bold text-[16px] !px-3 !pt-1">
                        {a || '[null]'} → {b || '[null]'}
                        {isLocked &&
                            <Button variant="text" color="default" className="!absolute !top-3 !right-3 !p-2"
                                onClick={() => setLocked?.(false)}>
                                <LockFilled className="opacity-25" />
                            </Button>
                        }
                    </div>
                }
                renderItem={(edit, idx) => {
                    return <List.Item className="select-none">
                        <Flex justify="space-between" gap={10} className="w-full">
                            <Flex key={`edit-${idx}`} gap={5}>{idx + 1}. {getVisualization(edit)}</Flex>
                            <EditTypeTag type={edit.type} />
                        </Flex>
                    </List.Item>
                }}
            />
        </div>
    </div>
}

const EditTypeTag = ({ type }: { type: EditTypeEnum }) => {
    switch (type) {
        case EditTypeEnum.DELETION:
            return <Tag color="red">Deletion</Tag>
        case EditTypeEnum.INSERTION:
            return <Tag color="green">Insertion</Tag>
        case EditTypeEnum.SUBSTITUTION:
            return <Tag color="gold">Substitution</Tag>
        case EditTypeEnum.TRANSPOSITION:
            return <Tag color="purple">Transposition</Tag>
        default:
            return <Tag>No edit</Tag>

    }
}