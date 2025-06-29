import { faker } from "@faker-js/faker";
import { register } from "../service/users.service";

export const generateRandomUser = async () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const payload = {
    firstName,
    lastName,
    email: faker.internet.email({
      firstName,
      lastName,
    }),
    password: "1234",
  };
  return await register(payload);
};

export const seedUsers = async () => {
  const john = await register({
    email: "johndoe@gmail.com",
    password: "1234",
    firstName: "John",
    lastName: "Doe",
  });
  return [john, await generateRandomUser()];
};
