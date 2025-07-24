import { faker } from "@faker-js/faker";

import { Project, User } from "../models";

async function seedProjects() {
    const user = await User.findAll({ attributes: ["id"] });
    const userIds = user.map((item) => item.dataValues.id);
    const projects = [];

    for (let i = 0; i < 200; i++) {
        const title = faker.company.catchPhrase();
        const description = faker.lorem.paragraph();
        const userId = faker.helpers.arrayElement(userIds);
        projects.push({
            title: title,
            description: description,
            userId: userId,
        });
    }
    await Project.bulkCreate(projects);
}

seedProjects()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
