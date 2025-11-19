import { lastChar, secondLastChar } from "../../../utils/utils";
import { LevenshteinEdit, LevenshteinStep } from "./base";
import { EditTypeEnum } from "../types";

export class DamerauLevenshteinEdit extends LevenshteinEdit {
    public transposition?: string[];

    constructor(
        public readonly from: DamerauLevenshteinStep | null,
        public readonly to: DamerauLevenshteinStep,
    ) {
        super(from, to)
        if (this.type === EditTypeEnum.TRANSPOSITION) {
            this.transposition = [secondLastChar(this.to.strA), lastChar(this.to.strA)]
        }
    }

    protected getEditType(): EditTypeEnum {
        if (this.from === this.to.diagonalTwo) {
            if (!this.to.canTranspose) {
                throw new Error('[DamerauLevenshteinEdit] cannot transpose')
            }
            return EditTypeEnum.TRANSPOSITION
        } else {
            return super.getEditType()
        }
    }
}

export class DamerauLevenshteinStep extends LevenshteinStep {
    constructor(
        x: number,
        y: number,
        strA: string, // section of the "from" string
        strB: string, // section of the "to" string
        public top?: DamerauLevenshteinStep,
        public left?: DamerauLevenshteinStep,
        public diagonal?: DamerauLevenshteinStep, // (top left)
        public diagonalTwo?: DamerauLevenshteinStep // (top top left left)
    ) {
        super(x, y, strA, strB, top, left, diagonal)
    }

    protected getEdit(from?: DamerauLevenshteinStep): DamerauLevenshteinEdit {
        return new DamerauLevenshteinEdit(from || null, this)
    }

    public get parents(): DamerauLevenshteinStep[] {
        const parents: DamerauLevenshteinStep[] =
            super.parents.filter(p => p instanceof DamerauLevenshteinStep);
        if (this.diagonalTwo && this.canTranspose && !this.isLastCharEqual) {
            parents.unshift(this.diagonalTwo)
        }
        return parents
    }

    public get canTranspose(): boolean {
        return !!(this.diagonalTwo &&
            (secondLastChar(this.strA) === lastChar(this.strB)) &&
            (lastChar(this.strA) === secondLastChar(this.strB)))
    }

    protected calcDistanceThroughParent = (step: LevenshteinStep): number => {
        if (!(step instanceof DamerauLevenshteinStep)) {
            throw new Error("[DamerauLevenshteinStep] invalid step has been provided as parent")
        }
        const edit = new DamerauLevenshteinEdit(step, this)
        return step.distance + edit.distance
    }
}