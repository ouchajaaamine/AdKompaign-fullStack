"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Campaign {
  id: number
  name: string
  budget: string
  roi: number
  status: string
}

interface TopCampaignsProps {
  campaigns: Campaign[]
}

export function TopCampaigns({ campaigns }: TopCampaignsProps) {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <h3 className="text-lg font-semibold text-foreground mb-4">Top Performing Campaigns</h3>
      <div className="space-y-3">
        {campaigns.map((campaign) => (
          <Link
            key={campaign.id}
            href={`/dashboard/campaigns/${campaign.id}`}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex-1">
              <p className="font-medium text-foreground">{campaign.name}</p>
              <p className="text-sm text-muted-foreground">Budget: {campaign.budget}</p>
            </div>
            <Badge variant={campaign.roi > 150 ? "default" : "secondary"}>{campaign.roi}% ROI</Badge>
          </Link>
        ))}
      </div>
    </Card>
  )
}
