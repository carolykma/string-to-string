import { Flex } from "antd"

type InteractiveGridProps = {
    text?: string
    size?: number
    disabled?: boolean
    positive?: boolean
    negative?: boolean
    active?: boolean
    setHovered?: () => void
}

export const InteractiveGrid = (props: InteractiveGridProps) => {
    const { text, size, disabled, positive, negative, active, setHovered } = props

    const getColorClass = () => {
        if (positive) return "bg-green-200"
        if (negative) return "bg-red-200"
        if (active) return "bg-blue-100"
        return "bg-white"
    }

    return (
        <Flex align="center" justify="center"
            style={{
                width: size || 35,
                height: size || 35,
            }}
            className={`${getColorClass()} ${disabled ? "" : "hover:bg-blue-100 cursor-pointer"}`}
            onMouseEnter={setHovered}
        >
            {text || " "}
        </Flex>
    )
}