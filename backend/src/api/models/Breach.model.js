import { model, Schema } from "mongoose";

const BreachSchema = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
    },
    name: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    breachDate: {
      type: Date,
      required: true,
    },
    compromisedAccounts: {
      type: Number,
      required: true,
    },
    compromisedData: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Breach", BreachSchema);
