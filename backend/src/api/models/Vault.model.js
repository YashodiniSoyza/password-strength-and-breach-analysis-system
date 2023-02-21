import { model, Schema } from "mongoose";

const VaultSchema = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    vault: {
      type: String,
      default: "",
    },
    salt: {
      type: String,
      required: true,
      default: "",
    },
  },
  { timestamps: true }
);

export default model("Vault", VaultSchema);
