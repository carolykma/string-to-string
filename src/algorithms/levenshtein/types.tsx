export type Coordinates = {
    x: number;
    y: number;
}

export enum EditTypeEnum {
    INSERTION = 'insertion',
    DELETION = 'deletion',
    SUBSTITUTION = 'substitution',
    TRANSPOSITION = 'transposition',
    NULL = 'null'
}