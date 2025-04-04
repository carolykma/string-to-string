import { Flex } from "antd"

type InteractiveGridProps = {
    text?: string
    size?: number
    disabled?: boolean
    active?: boolean
}

export const InteractiveGrid = (props: InteractiveGridProps) => {
    const { text, size, disabled, active } = props

    return (
        <Flex align="center" justify="center"
            style={{
                width: size || 35,
                height: size || 35,
            }}
            className={`${active ? "bg-blue-100" : "bg-white"} ${disabled ? "" : "hover:bg-blue-100 cursor-pointer"}`}
        >
            {text || " "}
        </Flex>
    )
}