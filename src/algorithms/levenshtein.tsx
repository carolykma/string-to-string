import _ from "lodash";
import { lastChar } from "../utils/utils";

export type Coordinates = {
    x: number;
    y: number;
}

export enum EditTypeEnum {
    INSERTION = 'insertion',
    DELETION = 'deletion',
    SUBSTITUTION = 'substitution',
    NULL = 'null'
}

export type Edit = {
    from?: Coordinates,
    to: Coordinates,
    type: EditTypeEnum
    deletion?: string;
    insertion?: string;
}

export class LevenshteinEdit {
    public type: EditTypeEnum;
    public deletion?: string;
    public insertion?: string;

    constructor(
        public readonly from: LevenshteinStep | null,
        public readonly to: LevenshteinStep,
    ) {
        const { strA, strB } = to
        switch (from) {
            case null: // origin
            case to.diagonal:
                if (to.isLastCharEqual) {
                    this.type = EditTypeEnum.NULL
                } else {
                    this.type = EditTypeEnum.SUBSTITUTION
                    this.deletion = lastChar(strA)
                    this.insertion = lastChar(strB)
                }
                break;
            case to.top:
                this.type = EditTypeEnum.INSERTION
                this.insertion = lastChar(strB)
                break;
            case to.left:
                this.type = EditTypeEnum.DELETION
                this.deletion = lastChar(strA)
                break;
            default:
                throw new Error('[LevenshteinEdit] invalid steps provided')
        }
    }

    public get distance(): number {
        return this.type === EditTypeEnum.NULL ? 0 : 1
    }
}

export class LevenshteinStep {
    public distance: number;
    private optimalParents: LevenshteinStep[]

    constructor(
        public x: number,
        public y: number,
        public strA: string, // section of the "from" string
        public strB: string, // section of the "to" string
        public top?: LevenshteinStep,
        public left?: LevenshteinStep,
        public diagonal?: LevenshteinStep,
    ) {
        this.distance = this.calcOptimalDistance()
        this.optimalParents = this.parents.filter(p => this.calcDistanceThroughParent(p) === this.distance);
    }

    public get isOrigin() { return !!(this.x === 0 && this.y === 0) }

    public get isLastCharEqual() {
        return lastChar(this.strA) === lastChar(this.strB)
    }

    private get parents(): LevenshteinStep[] {
        return [this.diagonal, this.left, this.top].filter(step => !!step)
    }

    private calcDistanceThroughParent = (step: LevenshteinStep): number => {
        const edit = new LevenshteinEdit(step, this)
        return step.distance + edit.distance
    }

    private calcOptimalDistance = (): number => {
        if (this.isOrigin) return this.isLastCharEqual ? 0 : 1;
        return _.min(this.parents.map(c => this.calcDistanceThroughParent(c))) || 0;
    }

    public getEditFromParent = (step?: LevenshteinStep): LevenshteinEdit => {
        if (!step && !this.isOrigin) {
            throw new Error('[getEditFromParent] missing ancestor step')
        }
        return new LevenshteinEdit(step || null, this)
    }

    public getSinglePath = (): LevenshteinStep[] => {
        const tracePath = (path: LevenshteinStep[]) => {
            const firstItem = path[0]
            if (!firstItem || firstItem.isOrigin) return path
            return tracePath([firstItem.optimalParents[0], ...path])
        }
        return tracePath([this])
    }

    public getAllStepsFromPaths = (): LevenshteinStep[] => {
        const set = new Set<LevenshteinStep>()
        const getAncestorsRecursively = (step: LevenshteinStep) => {
            if (set.has(step)) return // already called
            set.add(step)
            step.optimalParents.forEach(getAncestorsRecursively)
        }
        getAncestorsRecursively(this)
        return Array.from(set)
    }

    public getCoordinates = (): Coordinates => {
        return { x: this.x, y: this.y }
    }
}

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