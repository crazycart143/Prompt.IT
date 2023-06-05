import { Schema, model, models } from "mongoose";

const PromptSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  prompt: {
    type: String,
    required: [true, "Prompt is required."],
  },
  tag: {
    type: String,
    required: [true, "Tag is required"],
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  dislikes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
});

const Prompt = models.Prompt || model("Prompt", PromptSchema);

export default Prompt;
