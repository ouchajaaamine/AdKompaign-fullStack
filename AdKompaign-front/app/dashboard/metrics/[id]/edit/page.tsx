"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { fetchMetric, updateMetric } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function EditMetricPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    campaignId: "",
    clicks: "",
    conversions: "",
    revenue: "",
    date: "",
  })

  useEffect(() => {
    if (params.id) {
      fetchMetric(Number(params.id))
        .then((metric) => {
          setFormData({
            campaignId: metric.campaignId.toString(),
            clicks: metric.clicks.toString(),
            conversions: metric.conversions.toString(),
            revenue: metric.revenue,
            date: metric.date.split("T")[0],
          })
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      await updateMetric(Number(params.id), {
        campaignId: Number.parseInt(formData.campaignId),
        clicks: Number.parseInt(formData.clicks),
        conversions: Number.parseInt(formData.conversions),
        revenue: formData.revenue,
        date: formData.date,
      })
      router.push(`/dashboard/metrics/${params.id}`)
    } catch (error) {
      console.error("Failed to update metric:", error)
      alert("Failed to update metric. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/metrics/${params.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Metric</h1>
          <p className="text-muted-foreground">Update metric information</p>
        </div>
      </div>

      <Card className="max-w-2xl border-border bg-card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="campaignId">Campaign ID</Label>
            <Input
              id="campaignId"
              type="number"
              value={formData.campaignId}
              onChange={(e) => setFormData({ ...formData, campaignId: e.target.value })}
              placeholder="Enter campaign ID"
              required
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="clicks">Clicks</Label>
              <Input
                id="clicks"
                type="number"
                value={formData.clicks}
                onChange={(e) => setFormData({ ...formData, clicks: e.target.value })}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="conversions">Conversions</Label>
              <Input
                id="conversions"
                type="number"
                value={formData.conversions}
                onChange={(e) => setFormData({ ...formData, conversions: e.target.value })}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="revenue">Revenue</Label>
            <Input
              id="revenue"
              type="number"
              step="0.01"
              value={formData.revenue}
              onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Link href={`/dashboard/metrics/${params.id}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}
