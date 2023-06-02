//how to make own API endpoint

import { connectToDb } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async (request) => {
  try {
    await connectToDb(); //connect to db each time a new prompt is created
    const prompts = await Prompt.find({}).populate("creator");
    return new Response(JSON.stringify(prompts, { status: 200 }));
  } catch (error) {
    return new Response("Failed to fetch all prompts", { status: 500 });
  }
};
