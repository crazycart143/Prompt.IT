import Prompt from "@models/prompt";
import { connectToDb } from "@utils/database";

export const POST = async (request, { params }) => {
  const { prompt, tag, likes, dislikes, userId, removeLike } =
    await request.json();

  try {
    await connectToDb();

    // Find the existing prompt by ID
    const existingPrompt = await Prompt.findById(params.id);

    if (removeLike && existingPrompt.likes.includes(userId)) {
      // Remove the like if the user already liked the post
      existingPrompt.likes.pull(userId);
    } else {
      // Add the like if the user hasn't liked the post
      existingPrompt.likes.push(userId);
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
