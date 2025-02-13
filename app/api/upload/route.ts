import { sql } from "@/lib/another";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const POST = async (req: Request) => {
  try {
    console.log("Requested");

    // Check for valid content type
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return new Response(JSON.stringify({ error: "Invalid content type. Use multipart/form-data." }), { status: 400 });
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const description = formData.get("description") as string | null;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded. Please provide an image." }), { status: 400 });
    }

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");

    // Load API key from environment variables
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Construct prompt based on input
    let prompt = `
      Analyze the given wireframe image and generate code based on its structure. 
      Use modern best practices with responsive design and accessibility.
      Preferred technologies: HTML, Tailwind CSS, and React (if applicable).
      Ensure clean and modular code structure.
    `;

    if (description) {
      prompt += `\n\nAdditional details from user: ${description}`;
    }

    // Generate response
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: file.type,
        },
      },
      prompt,
    ]);

    return new Response(JSON.stringify({ generatedCode: result.response.text() }), { status: 200 });

  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};
