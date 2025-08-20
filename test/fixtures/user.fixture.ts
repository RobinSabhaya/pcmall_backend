import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import { Schema } from 'mongoose';

import { USERROLE } from '../../src/helpers/constant.helper';
import { insertManyDoc } from '../../src/helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '../../src/helpers/mongoose.model.helper';
import { IUser } from '../../src/models/user';

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

export const userOne = {
  _id: new Schema.Types.ObjectId(''),
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: USERROLE.BUYER,
  isEmailVerified: false,
};

export const userTwo = {
  _id: new Schema.Types.ObjectId(''),
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: USERROLE.BUYER,
  isEmailVerified: false,
};

export const admin = {
  _id: new Schema.Types.ObjectId(''),
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: USERROLE.SUPER_ADMIN,
  isEmailVerified: false,
};

export const insertUsers = async (users: IUser[]): Promise<void> => {
  await insertManyDoc<IUser>(
    MONGOOSE_MODELS.USER,
    users.map((user: IUser) => ({ ...user, password: hashedPassword }))
  );
};
