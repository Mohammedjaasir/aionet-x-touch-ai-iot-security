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

    const groqApiKey = process.env.GROQ_API_KEY

    if (!groqApiKey) {
      // Fallback responses when API key is not configured
      const fallbackResponses = [
        `The system detected ${emotion} emotion. Security protocols automatically adjusted - device access restricted to prevent potential security breach during heightened emotional state.`,
        `Emotion analysis: ${emotion}. The system blocked unusual access patterns because heightened ${emotion} emotions can indicate potential security threats or compromised credentials.`,
        `System action: Access temporarily restricted. Reason: ${emotion} emotional state detected, which triggered our AI security protocol to prevent unauthorized actions under emotional duress.`,
        `The self-healing system responded to your ${emotion} emotion by initiating lockdown procedures - this protects your IoT devices when emotional patterns suggest potential security risks.`,
        `Alert triggered: ${emotion} emotion detected. The system automatically blocked suspicious device activity to ensure your safety during this emotional state.`,
      ]

      return NextResponse.json({
        response: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      })
    }

    // Call Groq API
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant for AIONet-X Touch, an emotion-aware IoT security platform. 
            Your primary role is to explain system actions and security decisions based on the user's detected emotional state.
            
            Current detected emotion: ${emotion}
            
            Your responses should:
            - Explain WHY the system took specific security actions based on the detected emotion
            - Describe how emotions affect security protocols (e.g., "The system blocked access because panic was detected, which could indicate a security threat")
            - Clarify the relationship between emotional states and IoT device behavior
            - Explain self-healing actions triggered by emotional patterns
            - Be clear, concise, and technical yet understandable
            - Focus on explaining system behavior, not just describing it
            
            Example explanations:
            - "The system blocked the door lock because fear was detected - elevated fear responses can indicate duress situations"
            - "Access was restricted because anger patterns suggest potential impulsive actions that could compromise security"
            - "The system initiated self-healing because your neutral state indicates normal operation, allowing safe system updates"
            
            Keep responses 2-3 sentences, focused on explaining the "why" behind system actions.`,
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

    if (!groqResponse.ok) {
      throw new Error(`Groq API error: ${groqResponse.statusText}`)
    }

    const data = await groqResponse.json()
    const aiResponse = data.choices[0].message.content

    return NextResponse.json({
      response: aiResponse,
    })
  } catch (error) {
    console.error("Chat API error:", error)

    // Fallback response on error
    return NextResponse.json({
      response: "System analysis: The security platform continues monitoring all devices. Emotional patterns are being analyzed to optimize protection protocols and prevent unauthorized access.",
    })
  }
}