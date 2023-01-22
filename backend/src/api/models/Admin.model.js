import { model, Schema } from "mongoose";

const AdminSchema = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
    },
    adminId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
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
  },
  { timestamps: true }
);

export default model("Admin", AdminSchema);
