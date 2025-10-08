import { Schema, model, models, type Model, type Document } from "mongoose";
import bcrypt from "bcrypt"; // if this errors, use: import * as bcrypt from "bcrypt";

export type Role = "owner" | "employee" | "client";
export type Lang = "en" | "es";

export interface IUser {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: Role;
  preferredLanguage: Lang;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SafeUser = Pick<
  IUser,
  "name" | "email" | "phone" | "role" | "preferredLanguage"
> & { _id: string; createdAt?: Date; updatedAt?: Date };

export interface IUserMethods {
  setPassword(password: string): Promise<void>;
  verifyPassword(password: string): Promise<boolean>;
  toSafeObject(): SafeUser;
}

export type UserDocument = Document & IUser & IUserMethods;
export type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },
    phone: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["owner", "employee", "client"],
      default: "client",
    },
    preferredLanguage: { type: String, enum: ["en", "es"], default: "en" },
  },
  { timestamps: true }
);

// ---------- Methods (note typed params) ----------
UserSchema.methods.setPassword = async function (
  password: string
): Promise<void> {
  this.passwordHash = await bcrypt.hash(password, 10);
};

UserSchema.methods.verifyPassword = function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

UserSchema.methods.toSafeObject = function (): SafeUser {
  const {
    _id,
    name,
    email,
    phone,
    role,
    preferredLanguage,
    createdAt,
    updatedAt,
  } = this.toObject();
  return {
    _id: String(_id),
    name,
    email,
    phone,
    role,
    preferredLanguage,
    createdAt,
    updatedAt,
  };
};

UserSchema.index({ email: 1 }, { unique: true });

const User =
  (models.User as UserModel) || model<IUser, UserModel>("User", UserSchema);

export default User;
