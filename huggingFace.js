import { prevUser } from "./UserContext.jsx";

export async function query(prompt) {
  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    throw new Error("Prompt must be a non-empty string!");
  }

  const HF_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";
  const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;

  const response = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: prompt }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(errorText);
    throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
  }

  return await response.blob();
} 