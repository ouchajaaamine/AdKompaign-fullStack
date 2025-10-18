"use client"

import { useEffect, useMemo, useState } from "react"
import { fetchAffiliates, fetchCampaigns, fetchTopMetrics, fetchCampaignROI } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { TrendingUp, Users, DollarSign, PieChart, Target, Search, Grid3X3 } from "lucide-react"
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

export default function StatisticsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [affiliates, setAffiliates] = useState<any[]>([])
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [range, setRange] = useState<string>("all")  // Changed from "90d" to "all"
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all")

  useEffect(() => {
    async function loadAll() {
      setLoading(true)
      try {
        const [camps, affs, mets] = await Promise.all([
          fetchCampaigns(),
          fetchAffiliates(),
          fetchTopMetrics(500),  // Same limit as other pages
        ])
        setCampaigns(camps)
        setAffiliates(affs)
        setMetrics(mets as Metric[])
        console.log('Metrics page - Loaded metrics:', mets.length)
        console.log('Metrics page - Total revenue:', (mets as Metric[]).reduce((s, m) => s + parseFloat(m.revenue || "0"), 0))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadAll()
  }, [])

  const ms = { "30d": 30, "90d": 90, "180d": 180, all: 3650 }[range] || 3650  // Default to all time
  const since = useMemo(() => { const d = new Date(); d.setDate(d.getDate() - ms); return d }, [ms])

  const filteredMetrics = useMemo(() => {
    return metrics
      .filter(m => {
        const metricDate = m.timestamp ? new Date(m.timestamp) : null
        if (!metricDate) return false
        return metricDate >= since
      })
      .filter(m => selectedCampaign === "all" ? true : m.campaignId.toString() === selectedCampaign)
      .filter(m => {
        if (!search.trim()) return true
        const q = search.toLowerCase()
        return m.name.toLowerCase().includes(q) || (campaigns.find(c => c.id === m.campaignId)?.name || "").toLowerCase().includes(q)
      })
  }, [metrics, since, selectedCampaign, search, campaigns])

  // Aggregate KPIs
  const KPIs = useMemo(() => {
    // Use campaign revenue directly for total revenue
    const totalRevenue = campaigns.reduce((s, c) => s + (c.revenue || 0), 0)
    const totalClicks = filteredMetrics.reduce((s, m) => s + (m.clicks || 0), 0)
    const totalConv = filteredMetrics.reduce((s, m) => s + (m.conversions || 0), 0)
    const convRate = totalClicks > 0 ? +(totalConv / totalClicks * 100) : 0
    return { totalRevenue, totalClicks, totalConv, convRate }
  }, [campaigns, filteredMetrics])

  // Revenue by campaign - use campaign revenue directly
  const revenueByCampaign = useMemo(() => {
    return campaigns
      .filter(c => c.revenue && c.revenue > 0)
      .map(c => ({
        id: c.id,
        name: c.name,
        revenue: c.revenue || 0
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
  }, [campaigns])

  // No longer need to fetch ROI separately since it's in campaign data

  if (loading) return <div className="p-8 text-muted-foreground">Loading statistics…</div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.05 }} className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-primary" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold">Statistics</h1>
            <p className="text-sm text-muted-foreground">Consolidated statistics across campaigns, affiliates and metrics</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search campaigns or metrics..." className="pl-9 pr-3 h-9" value={search} onChange={e=>setSearch(e.target.value)} />
          </div>

          <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
            <SelectTrigger className="w-48 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All campaigns</SelectItem>
              {campaigns.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-32 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30d">30d</SelectItem>
              <SelectItem value="90d">90d</SelectItem>
              <SelectItem value="180d">180d</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>

        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center"><DollarSign className="h-5 w-5 text-green-600"/></div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-xl font-bold">{formatCurrency(KPIs.totalRevenue)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center"><Users className="h-5 w-5 text-blue-600"/></div>
            <div>
              <p className="text-sm text-muted-foreground">Affiliates</p>
              <p className="text-xl font-bold">{affiliates.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center"><Target className="h-5 w-5 text-purple-600"/></div>
            <div>
              <p className="text-sm text-muted-foreground">Total Conversions</p>
              <p className="text-xl font-bold">{KPIs.totalConv.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center"><PieChart className="h-5 w-5 text-orange-600"/></div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Conv. Rate</p>
              <p className="text-xl font-bold">{KPIs.convRate.toFixed(2)}%</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><TrendingUp className="h-5 w-5"/>Revenue by campaign</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={revenueByCampaign}>
              <XAxis dataKey="name" tick={{ fill: '#ffffff' }} />
              <YAxis tickFormatter={(v)=>`$${v}`} />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top campaigns (ROI)</h3>
          <div className="space-y-3">
            {revenueByCampaign.slice(0,5).map(c => {
              const campaign = campaigns.find(camp => camp.id === c.id)
              return (
                <div key={c.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-sm text-muted-foreground">{formatCurrency(c.revenue)} revenue</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{(campaign?.roi ?? 0).toFixed(2)}%</div>
                    <div className="text-sm text-muted-foreground">ROI</div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Notes & Quick insights</h3>
        <ul className="list-disc pl-6 text-muted-foreground">
          <li>Data aggregated from /api/campaigns, /api/affiliates and /api/metrics.</li>
          <li>Top campaigns ROI is fetched per campaign (best-effort) and may be 0 if backend doesn't expose it.</li>
          <li>Use the search and filters to narrow the dataset before exporting.</li>
        </ul>
      </Card>
    </div>
  )
}
