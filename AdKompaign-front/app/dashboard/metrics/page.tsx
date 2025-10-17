"use client"

import { useEffect, useMemo, useState } from "react"
import { fetchCampaigns, fetchTopMetrics } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TrendingUp, BarChart3, PieChart, Radar, Calendar, Sparkles, Search, Filter, SortAsc, Grid3X3, List, Activity, Target, DollarSign, MousePointer, Users } from "lucide-react"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Treemap, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RadarArea } from "recharts"
import { cn, formatCurrency } from "@/lib/utils"
import { motion } from "framer-motion"

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

export default function MetricsCockpitPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [range, setRange] = useState<string>("90d")
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "revenue" | "clicks" | "conversions" | "date">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [campaignFilter, setCampaignFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")

  useEffect(() => {
    async function load() {
      try {
        const [camps, mets] = await Promise.all([
          fetchCampaigns(),
          fetchTopMetrics(200),
        ])
        setCampaigns(camps)
        setMetrics(mets as Metric[])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    const ms = { "30d": 30, "90d": 90, "180d": 180, all: 3650 }[range] || 90
    const since = new Date(); since.setDate(since.getDate() - ms)
    
    return metrics
      .filter(m => new Date(m.timestamp) >= since)
      .filter(m => {
        // Campaign filter
        if (campaignFilter !== "all" && m.campaignId.toString() !== campaignFilter) return false
        
        // Search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase()
          return m.name.toLowerCase().includes(query) ||
                 campaigns.find(c => c.id === m.campaignId)?.name.toLowerCase().includes(query)
        }
        
        return true
      })
      .sort((a, b) => {
        let aValue: any, bValue: any

        switch (sortBy) {
          case "name":
            aValue = a.name.toLowerCase()
            bValue = b.name.toLowerCase()
            break
          case "revenue":
            aValue = parseFloat(a.revenue || "0")
            bValue = parseFloat(b.revenue || "0")
            break
          case "clicks":
            aValue = a.clicks || 0
            bValue = b.clicks || 0
            break
          case "conversions":
            aValue = a.conversions || 0
            bValue = b.conversions || 0
            break
          case "date":
            aValue = new Date(a.timestamp).getTime()
            bValue = new Date(b.timestamp).getTime()
            break
          default:
            return 0
        }

        if (sortOrder === "asc") {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
        } else {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
        }
      })
  }, [metrics, range, searchQuery, campaignFilter, sortBy, sortOrder, campaigns])

  // Smart fallback: if the selected range has no data, fall back to all-time
  const fallbackToAll = filtered.length === 0 && metrics.length > 0
  const effective = fallbackToAll ? metrics : filtered

  // Aggregate by campaign
  const byCampaign = useMemo(() => {
    const map = new Map<number, any>()
    for (const m of effective) {
      const entry = map.get(m.campaignId) || {
        id: m.campaignId,
        name: campaigns.find(c => c.id === m.campaignId)?.name || `Campaign #${m.campaignId}`,
        clicks: 0, conv: 0, revenue: 0
      }
      entry.clicks += m.clicks || 0
      entry.conv += m.conversions || 0
      entry.revenue += parseFloat(m.revenue || "0")
      map.set(m.campaignId, entry)
    }
    return Array.from(map.values())
      .map(e => ({ ...e, cr: e.clicks > 0 ? +(e.conv / e.clicks * 100).toFixed(2) : 0 }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6)
  }, [effective, campaigns])

  // Time series (by day)
  const series = useMemo(() => {
    const bucket = new Map<string, number>()
    for (const m of effective) {
      const d = new Date(m.timestamp); const key = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`
      bucket.set(key, (bucket.get(key) || 0) + parseFloat(m.revenue||"0"))
    }
    return Array.from(bucket.entries()).sort((a,b)=>a[0]>b[0]?1:-1).map(([date, revenue]) => ({ date, revenue }))
  }, [effective])

  // Radar metrics
  const radar = useMemo(() => {
    return byCampaign.map(c => ({
      campaign: c.name,
      Clicks: c.clicks,
      Conversions: c.conv,
      Revenue: Math.round(c.revenue)
    }))
  }, [byCampaign])

  // Insights
  const insights = useMemo(() => {
    if (byCampaign.length === 0) return [] as string[]
    const best = byCampaign[0]
    const highestCR = byCampaign.reduce((p, c) => (c.cr > p.cr ? c : p), byCampaign[0])
    const bestRPC = byCampaign
      .map(c => ({ name: c.name, rpc: c.clicks ? c.revenue / c.clicks : 0 }))
      .sort((a,b)=>b.rpc-a.rpc)[0]
    return [
      `Top revenue: ${best.name} with ${formatCurrency(best.revenue)}`,
      `Best conversion rate: ${highestCR.name} at ${highestCR.cr}%`,
      `Highest revenue/click: ${bestRPC.name} at ${formatCurrency(bestRPC.rpc)}`,
    ]
  }, [byCampaign])

  if (loading) {
    return <div className="p-8 text-muted-foreground">Loading metrics…</div>
  }

  if (!loading && metrics.length === 0) {
    return (
      <div className="p-8">
        <Card className="p-10 text-center border-dashed">
          <h2 className="text-xl font-semibold mb-2">No metrics found</h2>
          <p className="text-muted-foreground">Once metrics are created, this page will automatically summarize and visualize them.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-background via-background/90 to-background/70 rounded-2xl shadow-inner">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="h-10 w-10 rounded-xl bg-primary/10 backdrop-blur-sm flex items-center justify-center shadow-sm"
          >
            <Activity className="h-5 w-5 text-primary" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Metrics Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              {filtered.length} metric{filtered.length !== 1 ? "s" : ""} tracked
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {metrics.length > 0 && (
            <>
              <div className="relative flex-1 sm:flex-initial sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search metrics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 rounded-lg border-border/60 focus:border-primary focus:ring-primary/30 transition-all"
                />
              </div>

              {/* Filters and Sort */}
              <div className="flex items-center gap-2">
                <Select value={campaignFilter} onValueChange={setCampaignFilter}>
                  <SelectTrigger className="w-40 h-9">
                    <Target className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Campaigns</SelectItem>
                    {campaigns.map(campaign => (
                      <SelectItem key={campaign.id} value={campaign.id.toString()}>
                        {campaign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-32 h-9">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="clicks">Clicks</SelectItem>
                    <SelectItem value="conversions">Conversions</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="h-9 px-3"
                >
                  <SortAsc className={`h-4 w-4 transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`} />
                </Button>

                <div className="flex border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-9 px-3 rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className="h-9 px-3 rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(byCampaign.reduce((s,c)=>s+c.revenue,0))}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <MousePointer className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Clicks</p>
              <p className="text-2xl font-bold">{byCampaign.reduce((s,c)=>s+c.clicks,0).toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Conversions</p>
              <p className="text-2xl font-bold">{byCampaign.reduce((s,c)=>s+c.conv,0).toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Target className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Conv. Rate</p>
              <p className="text-2xl font-bold">{(byCampaign.reduce((s,c)=>s+c.cr,0)/(byCampaign.length||1)).toFixed(2)}%</p>
            </div>
          </div>
        </Card>
      </div>

      {fallbackToAll && (
        <Card className="p-3 text-xs text-muted-foreground border-amber-300/40 bg-amber-400/5 mb-6">
          No activity in the selected range. Showing all-time metrics instead.
        </Card>
      )}

      {viewMode === "grid" ? (
        <>
          {/* Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Revenue Area Chart */}
            <Card className="p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><TrendingUp className="h-5 w-5"/>Revenue over time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={series}>
                  <XAxis dataKey="date" stroke="hsl(var(--foreground))" fontSize={12} tick={{ fill: "#ffffff" }} />
                  <YAxis stroke="hsl(var(--foreground))" fontSize={12} tick={{ fill: "#ffffff" }} tickFormatter={(v)=>`$${v}`}/>
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))" }} />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b98122" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Revenue Share Treemap */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><PieChart className="h-5 w-5"/>Revenue share</h3>
              <ResponsiveContainer width="100%" height={300}>
                <Treemap
                  data={byCampaign.map(c=>({ name: c.name, size: Math.max(1, Math.round(c.revenue)) }))}
                  dataKey="size"
                  stroke="#1f2937"
                  fill="#22c55e"
                />
              </ResponsiveContainer>
              <div className="mt-3 grid grid-cols-1 gap-2">
                {byCampaign.map(c => (
                  <div key={c.id} className="flex items-center justify-between text-sm">
                    <span className="truncate pr-2">{c.name}</span>
                    <Badge variant="secondary">{formatCurrency(c.revenue)}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Performance Radar */}
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Radar className="h-5 w-5"/>Performance profile</h3>
            <ResponsiveContainer width="100%" height={360}>
              <RadarChart data={radar} outerRadius={120}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="campaign" tick={{ fill: "#ffffff" }} />
                <PolarRadiusAxis tick={{ fill: "#ffffff" }} />
                <RadarArea name="Clicks" dataKey="Clicks" stroke="#60a5fa" fill="#60a5fa33" />
                <RadarArea name="Conversions" dataKey="Conversions" stroke="#a78bfa" fill="#a78bfa33" />
                <RadarArea name="Revenue" dataKey="Revenue" stroke="#34d399" fill="#34d39933" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))" }} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          {/* Insights */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><BarChart3 className="h-5 w-5"/>Insights</h3>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              {insights.map((t, i) => (<li key={i}>{t}</li>))}
            </ul>
          </Card>
        </>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Metric</th>
                  <th className="text-left p-4 font-medium">Campaign</th>
                  <th className="text-left p-4 font-medium">Revenue</th>
                  <th className="text-left p-4 font-medium">Clicks</th>
                  <th className="text-left p-4 font-medium">Conversions</th>
                  <th className="text-left p-4 font-medium">Conv. Rate</th>
                  <th className="text-left p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((metric) => {
                  const campaign = campaigns.find(c => c.id === metric.campaignId)
                  const convRate = metric.clicks > 0 ? (metric.conversions / metric.clicks * 100).toFixed(2) : '0.00'
                  
                  return (
                    <tr key={metric.id} className="border-t hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-foreground">{metric.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {metric.id}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{campaign?.name || `Campaign #${metric.campaignId}`}</Badge>
                      </td>
                      <td className="p-4 font-medium text-green-600">{formatCurrency(parseFloat(metric.revenue))}</td>
                      <td className="p-4">{metric.clicks.toLocaleString()}</td>
                      <td className="p-4">{metric.conversions.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          parseFloat(convRate) > 5 ? 'bg-green-100 text-green-800' :
                          parseFloat(convRate) > 2 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {convRate}%
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(metric.timestamp).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
