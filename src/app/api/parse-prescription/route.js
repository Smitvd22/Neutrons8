// app/api/parse-prescription/route.js

import { NextResponse } from 'next/server';

async function analyzeImageWithGPT4(base64Image) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Process the uploaded image of the prescription medication and tell the following information in plaintext: 1. Prescribed Medicine: - Name of the medication - Dosage form (e.g., tablet, liquid, etc.) 2. Alternatives: - List at least three generic or brand-name alternatives to the prescribed medication. 3. Content: - Active ingredients - Inactive ingredients 4. Side Effects: - List common side effects - List serious side effects 5. Contraindications: - Identify specific groups of people who should not take this medication (e.g., pregnant women, individuals with certain health conditions). 6. Dosage Information: - Recommended dosage for adults and children (if applicable) - Frequency of administration (e.g., once daily, twice a day) - Special instructions (e.g., take with food, avoid alcohol)"
              },
              {
                type: "image_url",
                image_url: {
                  url: base64Image
                }
              }
            ]
          }
        ],
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('Failed to analyze prescription');
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${image.type};base64,${buffer.toString('base64')}`;

    const analysis = await analyzeImageWithGPT4(base64Image);

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process prescription' },
      { status: 500 }
    );
  }
}