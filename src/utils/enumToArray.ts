import { EnumType } from 'typescript'

export const enumToList = (enumObject: { [key: string]: string }) => {
    return Object.keys(enumObject).map((k) => enumObject[k].toString())
}
