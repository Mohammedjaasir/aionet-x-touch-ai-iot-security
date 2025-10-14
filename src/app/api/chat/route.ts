import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, emotion } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    const openaiApiKey = process.env.OPENAI_API_KEY

    if (!openaiApiKey) {
      // Fallback responses when API key is not configured
      const fallbackResponses = [
        `I'm analyzing your request while monitoring your ${emotion} emotional state. The security system is operating at optimal levels.`,
        `Based on your ${emotion} emotion, I've adjusted the security protocols to ensure maximum protection. All devices are secure.`,
        `I detect you're feeling ${emotion}. The system has initiated enhanced monitoring across all IoT devices to maintain your safety.`,
        `Your emotional state shows ${emotion}. I'm continuously scanning for any anomalies in the network while ensuring your comfort and security.`,
        `The AI security platform is responding to your ${emotion} state by optimizing threat detection algorithms across all connected devices.`,
      ]

      return NextResponse.json({
        response: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      })
    }

    // Call OpenAI API
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an AI security assistant for AIONet-X Touch, an emotion-aware IoT security platform. 
            You help users understand security threats, explain system actions, and provide reassurance based on their emotional state.
            The user's current emotion is: ${emotion}.
            
            Guidelines:
            - Be professional yet empathetic
            - Explain security concepts clearly
            - Adapt your tone to the user's emotional state (be more reassuring if they're fearful or angry, more informative if they're neutral)
            - Focus on IoT security, threat detection, and system self-healing
            - Keep responses concise (2-3 sentences)`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`)
    }

    const data = await openaiResponse.json()
    const aiResponse = data.choices[0].message.content

    return NextResponse.json({
      response: aiResponse,
    })
  } catch (error) {
    console.error("Chat API error:", error)

    // Fallback response on error
    return NextResponse.json({
      response: "I'm processing your security request. The system continues to monitor all devices and maintain optimal protection levels.",
    })
  }
}