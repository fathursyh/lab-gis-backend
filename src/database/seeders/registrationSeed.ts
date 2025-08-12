import { Event, Registration, User } from "../../models";


async function seedRegistration() {
    const registrations = [];
    const users = await User.findAll({
        attributes: ['id'],
        limit: 10,
    });
    const events = await Event.findAll({
        attributes: ['id'],
        limit: 30,
    });
    const today = new Date();
    for (let i = 0; i < 10; i++) {
        const registration = {
            userId: users[Math.round(Math.random() * 9)].dataValues.id,
            eventId: events[Math.round(Math.random() * 29)].dataValues.id,
            paymentId: `order-gis-${events[Math.round(Math.random() * 29)].dataValues.id.slice(0, 6)}-${today.getMonth()}${today.getFullYear}`
        }
        registrations.push(registration);
    }
    await Registration.bulkCreate(registrations);
    console.log('Seeded 10 registrations');
}

seedRegistration()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });