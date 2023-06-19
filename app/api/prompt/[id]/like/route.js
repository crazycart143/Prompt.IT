import Prompt from "@models/prompt";
import Notification from "@models/notification";
import { connectToDb } from "@utils/database";

export const POST = async (request, { params }) => {
  const { userId, removeLike, username, date, profilePicture } =
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

      let message;
      if (existingPrompt.creator.toString() === userId) {
        // Display a specific message when the creator likes their own post
        message = 'You liked your post: "' + existingPrompt.prompt + '".';
      } else {
        // Create a notification for the post creator
        message = `${username} liked your post: "${existingPrompt.prompt}."`;
      }

      // Create a notification for the post creator
      const notification = new Notification({
        recipient: existingPrompt.creator, // Assuming 'userId' is the creator's ID
        message: message,
        createdAt: date,
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
