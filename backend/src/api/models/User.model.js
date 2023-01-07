import { model, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default model("User", UserSchema);
