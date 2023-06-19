import Prompt from "@models/prompt";
import Notification from "@models/notification";
import { connectToDb } from "@utils/database";

export const POST = async (request, { params }) => {
  const { userId, removeLike, username, date, viewed, profilePicture } =
    await request.json();

  try {
    await connectToDb();

    // Find the existing prompt by ID
    const existingPrompt = await Prompt.findById(params.id);

    if (removeLike && existingPrompt.likes.includes(userId)) {
      // Remove the like if the user already liked the post
      existingPrompt.likes.pull(userId);

      await Notification.deleteOne({
        recipient: existingPrompt.creator, // Assuming 'userId' is the creator's ID
        "likedBy.userId": userId,
      });
    } else {
      // Add the like if the user hasn't liked the post
      existingPrompt.likes.push(userId);

      // Create a notification for the post creator
      const notification = new Notification({
        recipient: existingPrompt.creator, // Assuming 'userId' is the creator's ID
        message: `${username} liked your post: "${existingPrompt.prompt}."`,
        createdAt: date,
        viewed: viewed,
        profilePicture: profilePicture,
        likedBy: {
          userId: userId,
          username: username, // Replace with the actual username
        },
      });

      await notification.save();
    }

    await existingPrompt.save();

    return new Response(
      JSON.stringify({ message: "Successfully updated the like status" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error updating like status" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
