"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { fetchCampaign, fetchMetrics } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChatInterface } from "@/components/ai/chat-interface"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { ArrowLeft, DollarSign, MousePointer, TrendingUp, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CampaignDetailPage() {
  const params = useParams()
  const campaignId = Number.parseInt(params.id as string)
  const [campaign, setCampaign] = useState<any>(null)
  const [metrics, setMetrics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [campaignData, metricsData] = await Promise.all([fetchCampaign(campaignId), fetchMetrics()])
        setCampaign(campaignData)
        setMetrics(metricsData.filter((m) => m.campaignId === campaignId))
      } catch (error) {
        console.error("[v0] Error loading campaign details:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [campaignId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading campaign details...</div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Campaign not found</div>
      </div>
    )
  }

  const totalClicks = metrics.reduce((sum, m) => sum + (m.clicks || 0), 0)
  const totalConversions = metrics.reduce((sum, m) => sum + (m.conversions || 0), 0)
  const totalRevenue = metrics.reduce((sum, m) => sum + Number.parseFloat(m.revenue || 0), 0)
  const roi = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : 0

  const clicksData = metrics.map((m) => ({
    date: new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    clicks: m.clicks,
  }))

  const conversionsData = metrics.map((m) => ({
    date: new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    conversions: m.conversions,
  }))

  const budgetData = [
    { name: "Spent", value: totalRevenue },
    { name: "Remaining", value: Math.max(0, Number.parseFloat(campaign.budget) - totalRevenue) },
  ]

  const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))"]

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto p-8">
        <Link href="/dashboard/campaigns">
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Campaigns
          </Button>
        </Link>

        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{campaign.name}</h1>
              <p className="text-muted-foreground mt-1">
                {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
              </p>
            </div>
            <Badge variant={campaign.status === "active" ? "default" : "secondary"}>{campaign.status}</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3">
                  <MousePointer className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                  <p className="text-2xl font-bold text-foreground">{totalClicks.toLocaleString()}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Conversions</p>
                  <p className="text-2xl font-bold text-foreground">{totalConversions.toLocaleString()}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold text-foreground">${totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ROI</p>
                  <p className="text-2xl font-bold text-primary">{roi}%</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-4">Daily Clicks</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={clicksData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line type="monotone" dataKey="clicks" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-4">Conversions by Day</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={conversionsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="conversions" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">Budget Allocation</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={budgetData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                  outerRadius={100}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {budgetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      <div className="w-[400px] border-l border-border bg-sidebar/30 p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Campaign Assistant</h2>
        <ChatInterface campaignId={campaignId} className="h-[calc(100vh-120px)]" />
      </div>
    </div>
  )
}
