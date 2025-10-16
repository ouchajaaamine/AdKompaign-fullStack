"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Trash2, Edit, MousePointer, TrendingUp, DollarSign, Calendar } from "lucide-react"
import Link from "next/link"
import { fetchMetric, deleteMetric } from "@/lib/api"
import type { Metric } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function MetricDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [metric, setMetric] = useState<Metric | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchMetric(Number(params.id))
        .then(setMetric)
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [params.id])

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this metric?")) return

    setDeleting(true)
    try {
      await deleteMetric(Number(params.id))
      router.push("/dashboard/metrics")
    } catch (error) {
      console.error("Failed to delete metric:", error)
      alert("Failed to delete metric. Please try again.")
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!metric) {
    return <div>Metric not found</div>
  }

  const conversionRate = metric.clicks > 0 ? ((metric.conversions / metric.clicks) * 100).toFixed(2) : "0.00"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/metrics">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Metric Details</h1>
            <p className="text-muted-foreground">Campaign #{metric.campaignId}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/metrics/${metric.id}/edit`}>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive" className="gap-2" onClick={handleDelete} disabled={deleting}>
            <Trash2 className="h-4 w-4" />
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <MousePointer className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Clicks</p>
              <p className="text-2xl font-bold">{metric.clicks.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Conversions</p>
              <p className="text-2xl font-bold">{metric.conversions.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="text-2xl font-bold">${Number.parseFloat(metric.revenue).toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold">{conversionRate}%</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Metric Information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Campaign ID</p>
            <Badge variant="outline" className="mt-1">
              #{metric.campaignId}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Date</p>
            <div className="mt-1 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <p className="font-medium">{new Date(metric.date).toLocaleDateString()}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created At</p>
            <p className="mt-1 font-medium">{new Date(metric.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Updated At</p>
            <p className="mt-1 font-medium">{new Date(metric.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
