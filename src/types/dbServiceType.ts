import { Model, ModelStatic } from "sequelize"

export type FindAllFromDbType = {
    where: any,
    limit: number,
    offset: number,
    order: any,
    attributes: any[],
    page: number,
    includeModel?: ModelStatic<Model<any, any>>,
    alias?: string,
    includeAttributes?: any[],
    includeWhere?: any,
    innerJoin?: boolean
}