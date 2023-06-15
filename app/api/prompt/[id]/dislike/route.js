import Prompt from "@models/prompt";
import { connectToDb } from "@utils/database";

export const POST = async (request, { params }) => {
  const { userId, removeDislike } = await request.json();

  try {
    await connectToDb();

    // Find the existing prompt by ID
    const existingPrompt = await Prompt.findById(params.id);

    if (removeDislike && existingPrompt.dislikes.includes(userId)) {
      // Remove the dislike if the user already disliked the prompt
      existingPrompt.dislikes.pull(userId);
    } else if (!existingPrompt.dislikes.includes(userId)) {
      // Add the dislike if the user hasn't disliked the prompt
      existingPrompt.dislikes.push(userId);
    }

    await existingPrompt.save();

    return new Response(
      JSON.stringify({ message: "Successfully updated the dislike status" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error updating dislike status" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
