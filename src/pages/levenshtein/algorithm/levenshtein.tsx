import _ from "lodash";

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

export class LevenshteinStep {
    public value: number;

    constructor(
        public x: number,
        public y: number,
        public isLastCharEqual: boolean,
        public top?: LevenshteinStep,
        public left?: LevenshteinStep,
        public diagonal?: LevenshteinStep,
    ) {
        // compute
        if (this.isOrigin()) this.value = this.isLastCharEqual ? 0 : 1;
        const candidates = [];
        if (this.diagonal) candidates.push(this.diagonal.value + (this.isLastCharEqual ? 0 : 1));
        if (this.left) candidates.push(this.left.value + 1);
        if (this.top) candidates.push(this.top.value + 1);
        this.value = _.min(candidates) || 0;
    }

    isOrigin = () => {
        return !!(this.x === 0 && this.y === 0);
    }

    getCoordinates = (): Coordinates => {
        return { x: this.x, y: this.y }
    }

    getAncestors = (): LevenshteinStep[] => {
        return [this.diagonal, this.top, this.left]
            .filter(step => !!step)
            .filter((step) => {
                if (step === this.diagonal && this.isLastCharEqual) {
                    return step.value === this.value
                } else {
                    return step.value === this.value - 1
                }
            })
    }
}

export class Levenshtein {
    private readonly matrix: LevenshteinStep[][] = [];

    constructor(private a: string, private b: string) {
        for (let y = 0; y < b.length; y++) {
            this.matrix[y] = [];
            for (let x = 0; x < a.length; x++) {
                this.matrix[y].push(new LevenshteinStep(
                    x,
                    y,
                    a[x] === b[y],
                    this.getStep({ x, y: y - 1 }),
                    this.getStep({ x: x - 1, y }),
                    this.getStep({ x: x - 1, y: y - 1 }),
                ));
            }
        }
    }

    getStep = (coordinates: Coordinates): LevenshteinStep => {
        const { x, y } = coordinates;
        return this.matrix[y]?.[x];
    }

    hasStep = (coordinates: Coordinates): boolean => {
        return !!this.getStep(coordinates);
    }

    getMatrixValues = (): number[][] => {
        return this.matrix.map(row => row.map(step => step.value))
    }

    getAllPossibleStepsToTarget = (target: Coordinates): Coordinates[] => {
        if (!this.hasStep(target)) return [];
        const step = this.getStep(target)

        const set = new Set<LevenshteinStep>()
        const getAncestorsRecursively = (step: LevenshteinStep) => {
            if (set.has(step)) return // already called
            set.add(step)
            step.getAncestors().forEach(getAncestorsRecursively)
        }
        getAncestorsRecursively(step)
        return Array.from(set).map(step => step.getCoordinates())
    }

    getSinglePathToTarget = (target: Coordinates): Coordinates[] => {
        if (!this.hasStep(target)) return [];
        const step = this.getStep(target)
        const path: LevenshteinStep[] = [];
        const getAncestorsRecursively = (step: LevenshteinStep) => {
            path.unshift(step)
            const prev = step.getAncestors()[0]
            if (prev) getAncestorsRecursively(prev)
        }
        getAncestorsRecursively(step)
        return path.map(step => step.getCoordinates());
    }

    getEditFromSteps = (to: LevenshteinStep, from?: LevenshteinStep): Edit => {
        if (!from) {
            if (!to.isOrigin()) {
                throw new Error('[getEditFromSteps] missing from step')
            }
        } else if (!to.getAncestors().includes(from)) {
            throw new Error('[getEditFromSteps] invalid steps for edit')
        }

        let type: EditTypeEnum
        let deletion: string | undefined = undefined
        let insertion: string | undefined = undefined
        switch (from || null) {
            case null: // origin
            case to.diagonal:
                if (to.isLastCharEqual) {
                    type = EditTypeEnum.NULL
                } else {
                    type = EditTypeEnum.SUBSTITUTION
                    deletion = this.a[to.x]
                    insertion = this.b[to.y]
                }
                break;
            case to.top:
                type = EditTypeEnum.INSERTION
                insertion = this.b[to.y]
                break;
            case to.left:
                type = EditTypeEnum.DELETION
                deletion = this.a[to.x]
                break;
            default:
                throw new Error('[getEditFromSteps] unexpected error')
        }

        return {
            to: to.getCoordinates(),
            from: from?.getCoordinates(),
            type,
            deletion,
            insertion,
        }
    }

    getListOfEditsFromPath = (path: Coordinates[]): Edit[] => {
        return path.map((toCoordinates, idx) => {
            const to = this.getStep(toCoordinates)
            const from = idx > 0 ? this.getStep(path[idx - 1]) : undefined
            return this.getEditFromSteps(to, from)
        })
    }
}