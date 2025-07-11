import mongoose from "mongoose";
import { getEnv } from "../utils/env";
import { faker } from "@faker-js/faker";
import { registerWithEmail, registerWithPhone } from "../service/users.service";
import { AccountTypes } from "../types/account.types";

const password = "1234";

const createUserWithAccountType = async (accountType: AccountTypes) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });
  const phoneNumber = faker.helpers.replaceSymbols("+216 2#######");
  const basePayload = {
    firstName,
    lastName,
    password,
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    profilePhoto: faker.image.avatar(),
  };

  if (accountType === AccountTypes.CUSTOMER) {
    return await registerWithPhone({ ...basePayload, phoneNumber });
  } else {
    // For ADMIN, OPERATION, VENDOR, use email registration
    // registerWithEmail always creates ADMIN by default, so we need to adjust the service or create the account manually if needed
    // For now, use registerWithEmail and update the account type after creation if needed
    const user = await registerWithEmail({ ...basePayload, email });
    if (accountType !== AccountTypes.ADMIN) {
      // Update the account type in the Account model
      const accountModel = (await import("../Model/account.model")).default;
      await accountModel.findByIdAndUpdate(user.account, { accountType });
    }
    return user;
  }
};

export const seedUsers = async () => {
  const users = [];
  for (const type of Object.values(AccountTypes)) {
    users.push(await createUserWithAccountType(type));
  }
  return users;
};

if (require.main === module) {
  (async () => {
    try {
      await mongoose.connect(
        "mongodb+srv://gharbiameni17:ZrpRYDbOZ0GT12mH@cluster0.fbi5l.mongodb.net/kamarket?retryWrites=true&w=majority&appName=Cluster0"
      );
      console.log("Connected to MongoDB");
      const users = await seedUsers();
      console.log(
        `Seeded users:`,
        users.map((u) => ({
          id: u._id,
          firstName: u.firstName,
          lastName: u.lastName,
        }))
      );
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    } catch (err) {
      console.error("Seeding failed:", err);
      process.exit(1);
    }
  })();
}
