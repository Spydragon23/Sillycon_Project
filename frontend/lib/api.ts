/**
 * API utility for communicating with the Dark Web Dating Sim backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

/**
 * Map frontend agent IDs to backend personality types
 */
const AGENT_TO_PERSONALITY_MAP: Record<string, string> = {
  archivist: "pirate_thief",
  jester: "troll_scammer",
  witness: "hitman_cat",
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export interface ChatRequest {
  message: string
  personality: string
  history: ChatMessage[]
}

export interface ChatResponse {
  response: string
  emotion: string
  shouldExpand: boolean
}

/**
 * Send a chat message to the backend
 */
export async function sendChatMessage(
  message: string,
  agentId: string,
  history: ChatMessage[] = []
): Promise<ChatResponse> {
  const personality = AGENT_TO_PERSONALITY_MAP[agentId] || "pirate_thief"

  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      personality,
      history,
    } as ChatRequest),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }))
    throw new Error(error.detail || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

/**
 * Check if the backend is available
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
    })
    return response.ok
  } catch (error) {
    console.error("Backend health check failed:", error)
    return false
  }
}
