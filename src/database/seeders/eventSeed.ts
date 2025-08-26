import { faker } from '@faker-js/faker';
import { Event } from "../../models";

async function seedEvent() {
    const events = [];
    const total = 5;
    const titleBank = ['React Native', 'Javascript', 'Laravel', 'Code Igniter', 'Angular']
    for (let i = 0; i < titleBank.length; i++) {
        const event = {
            title: `Bootcamp ${titleBank[i]}`,
            description: faker.lorem.sentence(),
            mentor: faker.person.fullName(),
            location: 'iLab GIS',
            onlineLocation: 'gmeet.com',
            registerDate: faker.date.soon({days: 3}),
            startDate: faker.date.soon({days: 4}),
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