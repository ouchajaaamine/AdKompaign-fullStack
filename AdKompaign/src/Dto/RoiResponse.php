<?php

namespace App\Dto;

use Symfony\Component\Serializer\Annotation\Groups;

final class RoiResponse
{
    #[Groups(['roi:read'])]
    public int $campaignId;
    
    #[Groups(['roi:read'])]
    public string $campaignName;
    
    #[Groups(['roi:read'])]
    public float $budget;
    
    #[Groups(['roi:read'])]
    public float $totalRevenue;
    
    #[Groups(['roi:read'])]
    public float $roiPercentage;
    
    #[Groups(['roi:read'])]
    public string $status;
    
    #[Groups(['roi:read'])]
    public string $calculatedAt;

    public function __construct(
        int $campaignId,
        string $campaignName,
        float $budget,
        float $totalRevenue,
        float $roiPercentage,
        string $status,
        string $calculatedAt
    ) {
        $this->campaignId = $campaignId;
        $this->campaignName = $campaignName;
        $this->budget = $budget;
        $this->totalRevenue = $totalRevenue;
        $this->roiPercentage = $roiPercentage;
        $this->status = $status;
        $this->calculatedAt = $calculatedAt;
    }
}