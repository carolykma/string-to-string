import { RefObject, useCallback, useMemo } from "react"
import { Coordinates, Levenshtein } from "../../algorithms/levenshtein"
import _ from "lodash";

export const useLevenshteinHover = (
    levenshtein: RefObject<Levenshtein | undefined>,
    hovered?: Coordinates
) => {
    const allPossibleSteps = useMemo(() => {
        if (!hovered || !levenshtein.current) return []
        return levenshtein.current.getAllPossibleStepsToTarget(hovered)
    }, [hovered])

    const samplePath = useMemo(() => {
        if (!hovered || !levenshtein.current) return []
        return levenshtein.current.getSinglePathToTarget(hovered)
    }, [hovered])

    const samplePathEdits = useMemo(() => {
        if (!samplePath || !levenshtein.current) return
        return levenshtein.current.getListOfEditsFromPath(samplePath)
    }, [samplePath])

    const isSamplePath = useCallback(
        (coordinates: Coordinates) => samplePath.some((step) => _.isEqual(coordinates, step)),
        [samplePath]
    )

    const isPossibleStep = useCallback(
        (coordinates: Coordinates) => allPossibleSteps.some((step) => _.isEqual(coordinates, step)),
        [allPossibleSteps]
    )

    return {
        isSamplePath,
        isPossibleStep,
        samplePathEdits,
    }
}