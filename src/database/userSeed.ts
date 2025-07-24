import { faker } from '@faker-js/faker';
import { User } from '../models';

async function seedUsers() {
  const users = [];

  for (let i = 0; i < 50; i++) {
    const fullName = faker.person.fullName();
    const email = faker.internet.email({ firstName: fullName.split(' ')[0] });
    const password = 'test12345'; 

    users.push({
      fullName: fullName,
      email: email.toLowerCase(),
      password,
    });
  }

  await User.bulkCreate(users);
  console.log('Seeded 50 users');
}

seedUsers()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });