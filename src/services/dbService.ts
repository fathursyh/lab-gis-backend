import { Model, ModelStatic } from "sequelize";
import { FindAllFromDbType } from "../types/dbServiceType";

export const dbService = {
    findAllFromDb: async ({ where, limit, offset, order, attributes, page }: FindAllFromDbType, model: ModelStatic<Model<any, any>>) => {
        const { rows, count } = await model.findAndCountAll({
            where,
            limit,
            offset,
            order: order,
            attributes: attributes,
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
