import { Model, ModelStatic } from "sequelize";
import { FindAllFromDbType } from "../types/dbServiceType";

export const dbService = {
    findAllFromDb: async ({ where, limit, offset, order, attributes, page, includeModel, includeAttributes, alias, includeWhere, innerJoin }: FindAllFromDbType, model: ModelStatic<Model<any, any>>) => {
        const { rows, count } = await model.findAndCountAll({
            where,
            limit,
            offset,
            order: order,
            attributes: attributes,
            include: includeModel ?
            {
                model: includeModel,
                attributes: includeAttributes,
                as: alias,
                where: includeWhere,
                required: innerJoin ?? true,
            } : undefined
        });

        return {
            data: rows,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
            },
            hasMore: page * limit < count,
        };
    },
};
