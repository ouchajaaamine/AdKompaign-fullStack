export interface Campaign {
  id: number
  name: string
  budget: string
  startDate: string
  endDate: string
  status: "draft" | "active" | "paused" | "completed"
  createdAt: string
  updatedAt: string
  metrics?: string[]
  affiliates?: string[]
}

export interface Metric {
  id: number
  campaignId: number
  clicks: number
  conversions: number
  revenue: string
  date: string
  name: string
  value: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Affiliate {
  id: number
  name: string
  email: string
  campaigns: string[]
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface ChatResponse {
  response: string
  timestamp: string
  campaignId: number
}
