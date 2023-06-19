import { Schema, model, models } from "mongoose";

const NotificationSchema = new Schema({
  recipient: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Recipient is required."],
  },
  message: {
    type: String,
    required: [true, "Message is required."],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: [true, "CreatedAt is required."],
  },
  viewed: {
    type: Boolean,
    default: false,
  },
  profilePicture: {
    type: String, // Assuming the profile picture is stored as a URL
    required: [true, "Profile picture is required."],
  },
  likedBy: {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "LikedBy userId is required."],
    },
    username: {
      type: String,
      required: [true, "LikedBy username is required."],
    },
    // Additional fields to store relevant information about the user
  },
});

const Notification =
  models.Notification || model("Notification", NotificationSchema);

export default Notification;
