import { LevenshteinEdit, LevenshteinStep } from "./variations/base";
import { Coordinates, EditTypeEnum } from "./types";

export { LevenshteinEdit, LevenshteinStep }
export type { Coordinates }
export { EditTypeEnum }

export class Levenshtein {
    private readonly matrix: LevenshteinStep[][] = [];

    constructor(public a: string, public b: string) {
        const _a = `_${a}`
        const _b = `_${b}`

        for (let y = 0; y < _b.length; y++) {
            this.matrix[y] = [];
            for (let x = 0; x < _a.length; x++) {
                this.matrix[y].push(new LevenshteinStep(
                    x, y,
                    _a.slice(0, x + 1),
                    _b.slice(0, y + 1),
                    this.getStep({ x, y: y - 1 }),
                    this.getStep({ x: x - 1, y }),
                    this.getStep({ x: x - 1, y: y - 1 }),
                ));
            }
        }
    }

    private getStep = (coordinates: Coordinates): LevenshteinStep => {
        const { x, y } = coordinates;
        return this.matrix[y]?.[x];
    }

    public getMatrixValues = (): number[][] => {
        return this.matrix.map(row => row.map(step => step.distance))
    }

    public getAllPossibleStepsToTarget = (target: Coordinates): Coordinates[] => {
        const allSteps = this.getStep(target)?.getAllStepsFromPaths() || []
        return allSteps.map(step => step.getCoordinates())
    }

    public getSinglePathToTarget = (target: Coordinates): Coordinates[] => {
        const path = this.getStep(target)?.getSinglePath() || []
        return path.map(step => step.getCoordinates());
    }

    public getListOfEditsFromPath = (path: Coordinates[]): LevenshteinEdit[] => {
        return path.map((toCoordinates, idx) => {
            const to = this.getStep(toCoordinates)
            const from = idx > 0 ? this.getStep(path[idx - 1]) : undefined
            return to.getEditFromParent(from)
        })
    }
}