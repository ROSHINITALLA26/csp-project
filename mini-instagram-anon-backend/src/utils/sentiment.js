import fetch from "node-fetch";

export async function analyzeSentiment(text) {
  try {
    const response = await fetch("https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english", {
      method: "POST",
      headers: {
        Authorization: "Bearer YOUR_HUGGINGFACE_API_KEY",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    });

    const data = await response.json();
    const label = data[0]?.label?.toLowerCase() || "neutral";
    return label; // "positive", "negative", or "neutral"
  } catch (error) {
    console.error("Sentiment API failed:", error);
    return "neutral";
  }
}

