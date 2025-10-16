"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Mail, Calendar, Users } from "lucide-react"
import { fetchAffiliates } from "@/lib/api"
import type { Affiliate } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AffiliatesPage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAffiliates()
      .then(setAffiliates)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Affiliates</h1>
          <p className="text-muted-foreground">Manage your affiliate partners</p>
        </div>
        <Link href="/dashboard/affiliates/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Affiliate
          </Button>
        </Link>
      </div>

      {affiliates.length === 0 ? (
        <Card className="flex h-96 flex-col items-center justify-center gap-4 border-dashed">
          <Users className="h-12 w-12 text-muted-foreground" />
          <div className="text-center">
            <h3 className="text-lg font-semibold">No affiliates yet</h3>
            <p className="text-sm text-muted-foreground">Get started by adding your first affiliate partner</p>
          </div>
          <Link href="/dashboard/affiliates/new">
            <Button>Add Affiliate</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {affiliates.map((affiliate) => (
            <Link key={affiliate.id} href={`/dashboard/affiliates/${affiliate.id}`}>
              <Card className="group cursor-pointer border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Users className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {affiliate.campaigns?.length || 0} campaigns
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {affiliate.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {affiliate.email}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Joined {new Date(affiliate.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
