import Notification from "@models/notification";
import { connectToDb } from "@utils/database";

export const GET = async (request, { params }) => {
  try {
    await connectToDb();

    const notifications = await Notification.find({
      recipient: params.id,
    });

    return new Response(JSON.stringify(notifications), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch notifications", {
      status: 500,
    });
  }
};
