
import { NextResponse } from "next/server";
import Replicate from "replicate";

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
  try {
    console.log("POST request received at /generate");

    // Check if the API token is available
    if (!process.env.REPLICATE_API_TOKEN) {
      console.error("REPLICATE_API_TOKEN is not set.");
      return new Response("Server configuration error.", { status: 500 });
    }

    const body = await request.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      console.error("Missing required field: imageUrl");
      return new Response("Missing required field: imageUrl.", {
        status: 400,
      });
    }

    console.log("Image URL:", imageUrl);

    // Prepare the input for the model based on the schema
    const input = {
      prompt: "A photo of a person img receiving a professional business headshot, wearing a suit, looking confident, clear facial features, 8k uhd, dslr, soft lighting, high quality, 35mm lens, f/1.8, natural lighting, global illumination",
      num_steps: 50,
      style_name: "Photographic (Default)",
      input_image: imageUrl,
      num_outputs: 1,
      guidance_scale: 7.5,
      negative_prompt: "nsfw, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry",
      style_strength_ratio: 20,
      disable_safety_checker: false,
    };

    // POST request to Replicate to start the image generation process
    let startResponse;
    try {
      startResponse = await replicate.run(
        "tencentarc/photomaker:ddfc2b08d209f9fa8c1eca692712918bd449f695dabb4a958da31802a9570fe4",
        { input }
      );
    } catch (error) {
      console.error("Error making request to Replicate API:", error);
      return new Response("Failed to connect to the Replicate API.", {
        status: 500,
      });
    }

    console.log("Replicate API response:", startResponse);

    if (!startResponse || !Array.isArray(startResponse) || startResponse.length === 0) {
      console.error("Replicate API did not return a valid response.");
      return new Response("Failed to generate business headshot.", {
        status: 500,
      });
    }

    const outputUrl = startResponse[0]; // Assuming the output is a URL to the generated image

    console.log("Generated business headshot URL:", outputUrl);

    return NextResponse.json({ outputUrl });
  } catch (error) {
    console.error("Unexpected error in POST /generate:", error);
    return new Response("An unexpected error occurred.", { status: 500 });
  }
}

