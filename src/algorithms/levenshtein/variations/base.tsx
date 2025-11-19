import _ from "lodash";
import { lastChar } from "../../../utils/utils";
import { Coordinates, EditTypeEnum } from "../types";

export class LevenshteinEdit {
    public type: EditTypeEnum;
    public deletion?: string;
    public insertion?: string;

    constructor(
        public readonly from: LevenshteinStep | null,
        public readonly to: LevenshteinStep,
    ) {
        this.type = this.getEditType();

        const { strA, strB } = this.to
        if (this.type === EditTypeEnum.SUBSTITUTION) {
            this.deletion = lastChar(strA)
            this.insertion = lastChar(strB)
        } else if (this.type === EditTypeEnum.DELETION) {
            this.deletion = lastChar(strA)
        } else if (this.type === EditTypeEnum.INSERTION) {
            this.insertion = lastChar(strB)
        }

    }

    protected getEditType(): EditTypeEnum {
        switch (this.from) {
            case null: // origin
            case this.to.diagonal:
                return this.to.isLastCharEqual ? EditTypeEnum.NULL : EditTypeEnum.SUBSTITUTION;
            case this.to.top:
                return EditTypeEnum.INSERTION
            case this.to.left:
                return EditTypeEnum.DELETION
            default:
                throw new Error('[LevenshteinEdit] invalid steps provided')
        }
    }

    public get distance(): number {
        return this.type === EditTypeEnum.NULL ? 0 : 1
    }
}

export class LevenshteinStep {
    public distance: number = 0;
    protected optimalParents: LevenshteinStep[] = [];

    constructor(
        public x: number,
        public y: number,
        public strA: string, // section of the "from" string
        public strB: string, // section of the "to" string
        public top?: LevenshteinStep,
        public left?: LevenshteinStep,
        public diagonal?: LevenshteinStep,
    ) { }

    public init(): void {
        this.distance = this.calcOptimalDistance()
        this.optimalParents = this.parents.filter(p => this.calcDistanceThroughParent(p) === this.distance);
    }

    public get isOrigin() { return !!(this.x === 0 && this.y === 0) }

    public get isLastCharEqual() {
        return lastChar(this.strA) === lastChar(this.strB)
    }

    public get parents(): LevenshteinStep[] {
        return [this.diagonal, this.left, this.top].filter(step => !!step)
    }

    protected getEdit(from?: LevenshteinStep): LevenshteinEdit {
        return new LevenshteinEdit(from || null, this)
    }

    protected calcDistanceThroughParent = (step: LevenshteinStep): number => {
        const edit = this.getEdit(step)
        return step.distance + edit.distance
    }

    protected calcOptimalDistance = (): number => {
        if (this.isOrigin) return this.isLastCharEqual ? 0 : 1;
        return _.min(this.parents.map(c => this.calcDistanceThroughParent(c))) || 0;
    }

    public getEditFromParent = (step?: LevenshteinStep): LevenshteinEdit => {
        if (!step && !this.isOrigin) {
            throw new Error('[getEditFromParent] missing ancestor step')
        }
        return this.getEdit(step)
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

