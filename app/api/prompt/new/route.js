//how to make own API endpoint

import { connectToDb } from "@utils/database";
import Prompt from "@models/prompt";

export const POST = async (req) => {
  const { userId, prompt, tag } = await req.json();

  try {
    await connectToDb(); //connect to db each time a new prompt is created
    const newPrompt = new Prompt({ creator: userId, prompt, tag });
    await newPrompt.save(); //to save in database
    return new Response(JSON.stringify(newPrompt), { status: 201 }); //status 201 means created
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
