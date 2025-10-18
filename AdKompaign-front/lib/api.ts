export const API_BASE_URL = "http://localhost:8000"

// Helper to unwrap API Platform JSON-LD collections
function unwrapCollection(json: any): any[] {
  if (!json) return []
  // API Platform JSON-LD uses 'hydra:member' for collections
  if (Array.isArray(json["hydra:member"])) return json["hydra:member"]
  // Fallback for custom/JSON format collections
  if (Array.isArray(json.member)) return json.member
  // Sometimes the response could be a raw array
  if (Array.isArray(json)) return json
  return []
}

// Campaign API
export async function fetchCampaigns(): Promise<any[]> {
  try {
    console.log('Fetching campaigns from:', `${API_BASE_URL}/api/campaigns`)
    const response = await fetch(`${API_BASE_URL}/api/campaigns`)
    console.log('Campaigns response status:', response.status)
    if (!response.ok) {
      console.error('Campaigns fetch failed:', response.status, response.statusText)
      throw new Error(`Failed to fetch campaigns: ${response.status}`)
    }
    const data = await response.json()
    console.log('Campaigns raw data:', data)
    const campaigns = unwrapCollection(data)
    console.log('Campaigns unwrapped:', campaigns.length, 'items')
    return campaigns
  } catch (error) {
    console.error('Error in fetchCampaigns:', error)
    throw error
  }
}

export async function fetchCampaign(id: number): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/campaigns/${id}`)
  if (!response.ok) throw new Error("Failed to fetch campaign")
  return response.json()
}

export async function createCampaign(data: any): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/campaigns`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create campaign")
  return response.json()
}

export async function updateCampaign(id: number, data: any): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/campaigns/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to update campaign")
  return response.json()
}

export async function deleteCampaign(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/campaigns/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Failed to delete campaign")
}

export async function fetchCampaignROI(id: number): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/campaigns/${id}/roi`)
  if (!response.ok) throw new Error("Failed to fetch ROI")
  return response.json()
}

// Affiliate API
export async function fetchAffiliates(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/api/affiliates`)
  if (!response.ok) throw new Error("Failed to fetch affiliates")
  const data = await response.json()
  return unwrapCollection(data)
}

export async function fetchAffiliate(id: number): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/affiliates/${id}`)
  if (!response.ok) throw new Error("Failed to fetch affiliate")
  return response.json()
}

export async function createAffiliate(data: { name: string; email: string; campaigns?: string[] }): Promise<any> {
  console.log("Creating affiliate with data:", data)
  const response = await fetch(`${API_BASE_URL}/api/affiliates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  console.log("Response status:", response.status, response.statusText)
  if (!response.ok) {
    const errorText = await response.text()
    console.error("Error response:", errorText)
    throw new Error("Failed to create affiliate")
  }
  return response.json()
}

export async function updateAffiliate(id: number, data: { name: string; email: string; campaigns?: string[] }): Promise<any> {
  console.log("Updating affiliate", id, "with data:", data)
  const response = await fetch(`${API_BASE_URL}/api/affiliates/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/merge-patch+json",
    },
    body: JSON.stringify(data),
  })
  console.log("Response status:", response.status, response.statusText)
  if (!response.ok) {
    const errorText = await response.text()
    console.error("Error response:", errorText)
    throw new Error("Failed to update affiliate")
  }
  return response.json()
}

export async function deleteAffiliate(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/affiliates/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Failed to delete affiliate")
}

// Metrics API
export async function fetchMetrics(limit: number = 50): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/api/metrics?itemsPerPage=${limit}`)
  if (!response.ok) throw new Error("Failed to fetch metrics")
  const data = await response.json()
  return unwrapCollection(data)
}

export async function fetchTopMetrics(limit: number = 10): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/api/metrics?itemsPerPage=${limit}&order[timestamp]=desc`)
  if (!response.ok) throw new Error("Failed to fetch top metrics")
  const data = await response.json()
  return unwrapCollection(data)
}

export async function fetchMetric(id: number): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/metrics/${id}`)
  if (!response.ok) throw new Error("Failed to fetch metric")
  return response.json()
}

export async function createMetric(data: any): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/metrics`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create metric")
  return response.json()
}

export async function updateMetric(id: number, data: any): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/metrics/${id}`, {
    method: "PATCH",
    headers: {
      // API Platform expects JSON Merge Patch for PATCH
      "Content-Type": "application/merge-patch+json",
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to update metric")
  return response.json()
}

export async function deleteMetric(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/metrics/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Failed to delete metric")
}

// Chatbot API
export async function sendChatMessage(query: string, campaignId?: number): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/chatbot/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, campaignId }),
  })
  if (!response.ok) throw new Error("Failed to send message")
  return response.json()
}
