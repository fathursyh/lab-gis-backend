import { faker } from '@faker-js/faker';
import { Event } from "../../models";

async function seedEvent() {
    const events = [];

    for (let i = 0; i < 50; i++) {
        const event = {
            title: faker.lorem.sentence(),
            description: faker.lorem.sentence(),
            mentor: faker.person.fullName(),
            location: 'iLab GIS',
            startDate: faker.date.soon({days: 1}),
            endDate: faker.date.soon({days: 30}),
            quota: 20,
            price: 50000
        }

        events.push(event);
    }
    await Event.bulkCreate(events);
    console.log('Seeded 50 events')
}

seedEvent()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });