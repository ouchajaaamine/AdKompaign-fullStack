"use client"

import { useEffect, useState } from "react"
import { CampaignCard } from "@/components/campaigns/campaign-card"
import { fetchCampaigns, fetchMetrics, createCampaign, updateCampaign, deleteCampaign } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [metrics, setMetrics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<any>(null)
  
  // Form data
  const [formData, setFormData] = useState({
    name: "",
    budget: "",
    startDate: "",
    endDate: "",
    status: "draft"
  })
  
  const { toast } = useToast()

  useEffect(() => {
    async function loadData() {
      try {
        const [campaignsData, metricsData] = await Promise.all([fetchCampaigns(), fetchMetrics()])
        setCampaigns(campaignsData)
        setMetrics(metricsData)
      } catch (error) {
        console.error("[v0] Error loading campaigns:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const campaignsWithMetrics = campaigns.map((campaign) => {
    return {
      ...campaign,
      budget: `$${campaign.budget}`,
      revenue: formatCurrency(campaign.revenue || 0),
      roi: `${campaign.roi?.toFixed(2) || '0.00'}%`,
    }
  })

  const filteredCampaigns = campaignsWithMetrics.filter((campaign) => {
    // Status filter
    if (statusFilter !== "all" && campaign.status !== statusFilter) return false
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      return campaign.name.toLowerCase().includes(query)
    }
    
    return true
  })

  const handleEdit = (campaign: any) => {
    // Find the original campaign data (without formatting)
    const originalCampaign = campaigns.find(c => c.id === campaign.id)
    
    setEditingCampaign(originalCampaign)
    setFormData({
      name: originalCampaign.name,
      budget: originalCampaign.budget.toString(),
      startDate: originalCampaign.startDate.split('T')[0],
      endDate: originalCampaign.endDate ? originalCampaign.endDate.split('T')[0] : "",
      status: originalCampaign.status
    })
    setEditModalOpen(true)
  }

  const handleDelete = async (campaignId: number) => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      try {
        await deleteCampaign(campaignId)
        setCampaigns(campaigns.filter(c => c.id !== campaignId))
        toast({
          title: "Success",
          description: "Campaign deleted successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete campaign",
          variant: "destructive",
        })
      }
    }
  }

  const handleCreate = () => {
    setFormData({
      name: "",
      budget: "",
      startDate: "",
      endDate: "",
      status: "draft"
    })
    setCreateModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Campaign name is required",
        variant: "destructive",
      })
      return
    }
    
    const budgetValue = parseFloat(formData.budget)
    if (isNaN(budgetValue) || budgetValue <= 0) {
      toast({
        title: "Validation Error", 
        description: "Budget must be a positive number",
        variant: "destructive",
      })
      return
    }
    
    if (formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      toast({
        title: "Validation Error",
        description: "End date must be after or equal to start date",
        variant: "destructive",
      })
      return
    }
    
    try {
      const data = {
        name: formData.name.trim(),
        budget: budgetValue.toString(), // Convert to string as API expects
        startDate: formData.startDate + 'T00:00:00.000Z',
        endDate: formData.endDate ? formData.endDate + 'T23:59:59.000Z' : null,
        status: formData.status
      }

      if (editingCampaign) {
        // Update existing campaign
        await updateCampaign(editingCampaign.id, data)
        setCampaigns(campaigns.map(c => 
          c.id === editingCampaign.id ? { ...c, ...data } : c
        ))
        setEditModalOpen(false)
        setEditingCampaign(null)
        toast({
          title: "Success",
          description: "Campaign updated successfully",
        })
      } else {
        // Create new campaign
        const newCampaign = await createCampaign(data)
        setCampaigns([...campaigns, newCampaign])
        setCreateModalOpen(false)
        toast({
          title: "Success",
          description: "Campaign created successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: editingCampaign ? "Failed to update campaign" : "Failed to create campaign",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading campaigns...</div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campaigns</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor your marketing campaigns</p>
        </div>
        <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={handleCreate}>
              <Plus className="h-4 w-4" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Campaign
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Campaign</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-budget">Budget</Label>
                <Input
                  id="edit-budget"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-startDate">Start Date</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-endDate">End Date</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Update Campaign
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-3">
        <Button
          variant={statusFilter === "all" ? "default" : "outline"}
          onClick={() => setStatusFilter("all")}
          className="px-6 py-3 text-base"
        >
          All Campaigns
        </Button>
        <Button
          variant={statusFilter === "active" ? "default" : "outline"}
          onClick={() => setStatusFilter("active")}
          className="px-6 py-3 text-base"
        >
          Active
        </Button>
        <Button
          variant={statusFilter === "draft" ? "default" : "outline"}
          onClick={() => setStatusFilter("draft")}
          className="px-6 py-3 text-base"
        >
          Draft
        </Button>
        <Button
          variant={statusFilter === "completed" ? "default" : "outline"}
          onClick={() => setStatusFilter("completed")}
          className="px-6 py-3 text-base"
        >
          Completed
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search campaigns by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => (
          <CampaignCard 
            key={campaign.id} 
            campaign={campaign} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {statusFilter === "all" 
              ? "No campaigns found. Create your first campaign to get started." 
              : `No ${statusFilter} campaigns found.`
            }
          </p>
        </div>
      )}
    </div>
  )
}
