import mongoose, { Document, Schema } from 'mongoose';
import { Account, AccountTypes } from '../types/account.types';

type IAccount = Account & Document;

const AccountSchema: Schema = new Schema(
  {
    accountType: {
      type: String,
      enum: Object.values(AccountTypes),
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAccount>('Account', AccountSchema);