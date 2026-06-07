export async function getAIRecommendation(userPrompt, products) {
  try {

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return products;
    }


    const URL =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;


    const aiProducts = products.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      rating: p.rating,
      countInStock: p.countInStock,
      image: p.image,
    }));


    const geminiPrompt = `
You are an AI product recommendation assistant.

Here is the product list:
${JSON.stringify(aiProducts, null, 2)}

User request:
"${userPrompt}"

Return only JSON array.
`;


    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: geminiPrompt,
              },
            ],
          },
        ],
      }),
    });


    const data = await response.json();


    // AI quá tải, quota, lỗi server
    if (!response.ok) {
      console.log(
        "AI unavailable:",
        data?.error?.message
      );

      return products;
    }


    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";


    if (!text) {
      return products;
    }


    const clean = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();


    const result = JSON.parse(clean);


    if (!Array.isArray(result)) {
      return products;
    }


    return result;


  } catch (error) {

    console.log(
      "AI fallback:",
      error.message
    );


    return products;
  }
}