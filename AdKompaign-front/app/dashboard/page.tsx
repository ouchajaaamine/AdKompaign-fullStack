"use client"

import { useEffect, useState } from "react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { MetricsOverview } from "@/components/dashboard/metrics-overview"
import { DollarSign, TrendingUp, Target, Activity } from "lucide-react"
import { fetchCampaigns, fetchTopMetrics } from "@/lib/api"

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [metrics, setMetrics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [campaignsData, metricsData] = await Promise.all([fetchCampaigns(), fetchTopMetrics(200)])
        setCampaigns(campaignsData)
        setMetrics(metricsData)
      } catch (error) {
        console.error("[v0] Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const totalRevenue = campaigns.reduce((sum, c) => sum + (c.revenue || 0), 0)
  const totalCampaigns = campaigns.length
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length
  const avgROI =
    campaigns.length > 0
      ? (campaigns.reduce((sum, c) => sum + (c.roi || 0), 0) / campaigns.length).toFixed(2)
      : "0.00"

  const revenueData = campaigns
    .filter((c) => c.createdAt)
    .slice(-10)
    .map((c, index) => ({
      date: new Date(new Date(c.createdAt).getTime() + index * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      revenue: c.revenue || 0,
    }))

  // Removed TopCampaigns section as requested

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your campaign overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Campaigns" value={totalCampaigns} icon={Target} trend="+12% from last month" />
        <StatsCard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(0)}`}
          icon={DollarSign}
          trend="+23% from last month"
        />
        <StatsCard title="Average ROI" value={`${avgROI}%`} icon={TrendingUp} trend="+8% from last month" />
        <StatsCard title="Active Campaigns" value={activeCampaigns} icon={Activity} />
      </div>

      <RevenueChart data={revenueData} />

      <MetricsOverview metrics={metrics} campaigns={campaigns} />
    </div>
  )
}
