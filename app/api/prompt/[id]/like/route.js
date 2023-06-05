import Prompt from "@models/prompt";
import { connectToDb } from "@utils/database";

export const POST = async (request, { params }) => {
  const { prompt, tag, likes, dislikes, userId } = await request.json();

  try {
    await connectToDb();

    // Find the existing prompt by ID
    const existingPrompt = await Prompt.findById(params.id);

    if (existingPrompt.likes.includes(userId)) {
      return new Response("User has already liked the post", { status: 400 });
    }
    // Update the prompt with new data

    // Ensure likes and dislikes are arrays
    existingPrompt.likes.push(userId);
    await existingPrompt.save();

    return new Response("Successfully liked the post", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error updating Prompt", { status: 500 });
  }
};
