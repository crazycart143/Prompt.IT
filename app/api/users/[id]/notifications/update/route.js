import Notification from "@models/notification";
import { connectToDb } from "@utils/database";

export const PATCH = async (request, { params }) => {
  try {
    await connectToDb();
    const notifications = await Notification.find({ recipient: params.id });

    if (notifications && notifications.length > 0) {
      for (const notification of notifications) {
        notification.viewed = true;
        await notification.save();
      }

      console.log("Notifications updated");
      return new Response("Successfully updated the Notifications", {
        status: 200,
      });
    } else {
      console.log("No notifications found for the user.");
    }
  } catch (error) {
    console.error("Failed to update notifications:", error);
    return new Response("Failed to update notifications", {
      status: 500,
    });
  }
};
