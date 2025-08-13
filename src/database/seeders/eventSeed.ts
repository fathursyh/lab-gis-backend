import { faker } from '@faker-js/faker';
import { Event } from "../../models";

async function seedEvent() {
    const events = [];
    const total = 140;
    for (let i = 0; i < total; i++) {
        const event = {
            title: 'Pengenalan GIS Bootcamp',
            description: faker.lorem.sentence(),
            mentor: faker.person.fullName(),
            location: 'iLab GIS',
            startDate: faker.date.soon({days: 1}),
            endDate: faker.date.soon({days: 30}),
            quota: faker.number.int({min: 25, max: 50}),
            price: faker.finance.amount({min: 100000, max: 500000})
        }

        events.push(event);
    }
    await Event.bulkCreate(events);
    console.log(`Seeded ${total} events`)
}

seedEvent()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });