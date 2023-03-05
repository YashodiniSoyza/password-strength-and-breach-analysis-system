import { model, Schema } from "mongoose";
import Breach from "./Breach.model";
const LeakedDataSchema = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
    },
    breachId: {
      type: Schema.Types.ObjectId,
      ref: Breach,
      required: true,
    },
    email: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    username: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    hash: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default model("LeakedData", LeakedDataSchema);
