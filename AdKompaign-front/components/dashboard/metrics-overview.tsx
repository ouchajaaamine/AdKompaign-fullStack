"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, BarChart3, Zap, Target } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface Metric {
  id: number
  name: string
  value: string
  clicks: number
  conversions: number
  revenue: string
  timestamp: string
  campaignId: number
}

interface MetricsOverviewProps {
  metrics: Metric[]
  campaigns: any[]
}

export function MetricsOverview({ metrics, campaigns }: MetricsOverviewProps) {
  // Group metrics by campaign and calculate aggregates
  const metricsByCampaign = metrics.reduce(
    (acc, metric) => {
      const campaignId = metric.campaignId
      if (!acc[campaignId]) {
        acc[campaignId] = {
          campaignId,
          campaignName: campaigns.find((c) => c.id === campaignId)?.name || "Unknown",
          totalClicks: 0,
          totalConversions: 0,
          totalRevenue: 0,
          conversionRate: 0,
          revenuePerClick: 0,
          metricCount: 0,
        }
      }
      acc[campaignId].totalClicks += metric.clicks || 0
      acc[campaignId].totalConversions += metric.conversions || 0
      acc[campaignId].totalRevenue += parseFloat(metric.revenue || "0")
      acc[campaignId].metricCount += 1
      return acc
    },
    {} as Record<
      number,
      {
        campaignId: number
        campaignName: string
        totalClicks: number
        totalConversions: number
        totalRevenue: number
        conversionRate: number
        revenuePerClick: number
        metricCount: number
      }
    >
  )

  // Calculate derived metrics
  Object.values(metricsByCampaign).forEach((campaign: any) => {
    campaign.conversionRate =
      campaign.totalClicks > 0 ? ((campaign.totalConversions / campaign.totalClicks) * 100).toFixed(2) : "0"
    campaign.revenuePerClick = campaign.totalClicks > 0 ? (campaign.totalRevenue / campaign.totalClicks).toFixed(2) : "0"
  })

  // Sort by revenue (descending) and take top 3
  const topCampaignMetrics = (Object.values(metricsByCampaign) as any[])
    .sort((a: any, b: any) => b.totalRevenue - a.totalRevenue)
    .slice(0, 3)

  // Calculate aggregate stats
  const totalClicks = metrics.reduce((sum, m) => sum + (m.clicks || 0), 0)
  const totalConversions = metrics.reduce((sum, m) => sum + (m.conversions || 0), 0)
  const totalRevenue = metrics.reduce((sum, m) => sum + parseFloat(m.revenue || "0"), 0)

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200/20">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{totalClicks.toLocaleString()}</p>
              </div>
              <Zap className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-200/20">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Conversions</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{totalConversions.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {((totalConversions / totalClicks) * 100).toFixed(2)}% conversion rate
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200/20">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{formatCurrency(totalRevenue)}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {formatCurrency(totalRevenue / totalClicks)}/click
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Top Performing Campaigns
          </CardTitle>
          <CardDescription>Best performing campaigns by revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCampaignMetrics.map((campaign) => (
              <div key={campaign.campaignId} className="p-4 border border-border rounded-lg hover:bg-accent/50 transition">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{campaign.campaignName}</h3>
                    <p className="text-xs text-muted-foreground">{campaign.metricCount} metrics tracked</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{formatCurrency(campaign.totalRevenue)}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="bg-blue-500/10 p-2 rounded">
                    <p className="text-xs text-muted-foreground">Clicks</p>
                    <p className="font-semibold text-blue-600">{campaign.totalClicks.toLocaleString()}</p>
                  </div>
                  <div className="bg-purple-500/10 p-2 rounded">
                    <p className="text-xs text-muted-foreground">Conversions</p>
                    <p className="font-semibold text-purple-600">
                      {campaign.totalConversions.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-orange-500/10 p-2 rounded">
                    <p className="text-xs text-muted-foreground">Conv. Rate</p>
                    <p className="font-semibold text-orange-600">{campaign.conversionRate}%</p>
                  </div>
                </div>

                <div className="mt-3 bg-gradient-to-r from-green-500/20 to-green-600/20 p-2 rounded text-xs">
                  <span className="text-green-700 font-semibold">{formatCurrency(campaign.revenuePerClick)}</span>
                  <span className="text-muted-foreground"> per click</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
