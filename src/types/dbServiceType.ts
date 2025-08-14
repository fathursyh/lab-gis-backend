import { Model, ModelStatic } from "sequelize"

export type FindAllFromDbType = {
    where: any,
    limit: number,
    offset: number,
    order: any,
    attributes: string[],
    page: number,
    includeModel?: ModelStatic<Model<any, any>>,
    alias?: string,
    includeAttributes?: string[]
}