import crypto from 'crypto';
import { NextFunction } from 'express';
import mongoose, {
  Schema,
  Model,
  Document,
  InferSchemaType,
  Types,
} from 'mongoose';
import { OmitTimestamps } from '../interfaces/omit-timestamps.interface';

const userSchema = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      select: true,
      required: true,
      minlength: 8,
    },
    passwordSalt: {
      type: String,
      select: true,
    },
  },
  {
    collection: 'users',
    timestamps: true,
  }
);

userSchema.pre<IUser>('save', async function (next: NextFunction) {
  if (!this.isModified('password')) {
    return next();
  }

  // Password hashing logic
  this.passwordSalt = this.passwordSalt
    ? this.passwordSalt
    : crypto.randomBytes(128).toString('base64');
  this.password = crypto
    .pbkdf2Sync(this.password, this.passwordSalt, 1000, 64, `sha512`)
    .toString(`hex`);
  next();
});

userSchema.methods.validPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.passwordSalt, 1000, 64, `sha512`)
    .toString(`hex`);
  return this.password === hash;
};

interface IUserSchema extends InferSchemaType<typeof userSchema>, Document {
  validPassword(password: string): boolean;
  setNewPassword(newPassword?: string): string;
}
type IUser = OmitTimestamps<IUserSchema>;

const User: Model<IUserSchema> = mongoose.model<IUserSchema>(
  'User',
  userSchema
);

export { User, IUser, IUserSchema };
