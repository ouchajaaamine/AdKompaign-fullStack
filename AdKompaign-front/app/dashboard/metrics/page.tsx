"use client"

import { useEffect, useMemo, useState } from "react"
import { fetchCampaigns, fetchTopMetrics } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, BarChart3, PieChart, Radar, Calendar, Sparkles } from "lucide-react"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Treemap, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RadarArea } from "recharts"
import { cn, formatCurrency } from "@/lib/utils"

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
    return metrics.filter(m => new Date(m.timestamp) >= since)
  }, [metrics, range])

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
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">Metrics Cockpit <Sparkles className="h-6 w-6 text-yellow-400" /></h1>
          <p className="text-muted-foreground">A focused, intelligent view of your marketing performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Range" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="180d">Last 180 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {fallbackToAll && (
        <Card className="p-3 text-xs text-muted-foreground border-amber-300/40 bg-amber-400/5">
          No activity in the selected range. Showing all-time metrics instead.
        </Card>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Revenue", value: formatCurrency(byCampaign.reduce((s,c)=>s+c.revenue,0)), tone: "from-green-500/10 to-green-600/10" },
          { label: "Avg. Conv. Rate", value: `${(byCampaign.reduce((s,c)=>s+c.cr,0)/(byCampaign.length||1)).toFixed(2)}%`, tone: "from-purple-500/10 to-purple-600/10" },
          { label: "Total Clicks", value: byCampaign.reduce((s,c)=>s+c.clicks,0).toLocaleString(), tone: "from-blue-500/10 to-blue-600/10" },
        ].map((kpi, i) => (
          <Card key={i} className={cn("p-6 border-border bg-gradient-to-br", kpi.tone)}>
            <div className="text-sm text-muted-foreground">{kpi.label}</div>
            <div className="text-3xl font-semibold mt-2">{kpi.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
      <Card className="p-6">
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
    </div>
  )
}
