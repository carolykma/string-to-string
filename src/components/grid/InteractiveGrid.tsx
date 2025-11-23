import { Flex } from "antd"

type InteractiveGridProps = {
    text?: string
    size?: number
    bg?: string
    bgHovered?: string
    isHovered?: boolean
    setHovered?: () => void
    locked?: boolean
    setLocked?: (value: boolean) => void
}

export const InteractiveGrid = (props: InteractiveGridProps) => {
    const { text, size, bg = 'white', bgHovered = 'blue', isHovered, setHovered, locked, setLocked } = props

    return (
        <Flex align="center" justify="center"
            style={{
                width: size || 35,
                height: size || 35,
                backgroundColor: isHovered ? bgHovered : bg,
                cursor: 'pointer'
            }}
            onMouseEnter={() => !locked && setHovered?.()}
            onClick={() => locked ? setHovered?.() : setLocked?.(true)}
            className="select-none"
        >
            {text || " "}
        </Flex >
    )
}