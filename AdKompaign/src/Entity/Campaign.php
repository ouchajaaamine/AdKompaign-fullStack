<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use App\Controller\RoiController;
use App\Dto\RoiResponse;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(),
        new Put(),
        new Delete(),
        new Get(
            uriTemplate: '/campaigns/{id}/roi',
            controller: RoiController::class,
            output: RoiResponse::class,
            normalizationContext: ['groups' => ['roi:read']],
            name: 'get_roi'
        )
    ],
    normalizationContext: ['groups' => ['campaign:read']],
    denormalizationContext: ['groups' => ['campaign:write']]
)]
#[ApiFilter(SearchFilter::class, properties: ['name' => 'partial'])]
class Campaign
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['campaign:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['campaign:read', 'campaign:write'])]
    private ?string $name = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2, options: ["default" => 0.00])]
    #[Groups(['campaign:read', 'campaign:write'])]
    private ?float $budget = 0.00;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    #[Groups(['campaign:read', 'campaign:write'])]
    private ?\DateTimeImmutable $startDate = null;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE, nullable: true)]
    #[Groups(['campaign:read', 'campaign:write'])]
    private ?\DateTimeImmutable $endDate = null;

    #[ORM\Column(length: 255, options: ["default" => "draft"])]
    #[Groups(['campaign:read', 'campaign:write'])]
    private ?string $status = 'draft';

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    #[Groups(['campaign:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    #[Groups(['campaign:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\OneToMany(mappedBy: 'campaign', targetEntity: Metric::class, orphanRemoval: true)]
    #[Groups(['campaign:read'])]
    private Collection $metrics;

    #[ORM\ManyToMany(targetEntity: Affiliate::class, inversedBy: 'campaigns')]
    #[Groups(['campaign:read'])]
    private Collection $affiliates;

    public function __construct()
    {
        $this->metrics = new ArrayCollection();
        $this->affiliates = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    #[ORM\PrePersist]
    public function prePersist(): void
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    #[ORM\PreUpdate]
    public function preUpdate(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getBudget(): ?float
    {
        return $this->budget;
    }

    public function setBudget(float $budget): static
    {
        $this->budget = $budget;

        return $this;
    }

    public function getStartDate(): ?\DateTimeImmutable
    {
        return $this->startDate;
    }

    public function setStartDate(\DateTimeImmutable $startDate): static
    {
        $this->startDate = $startDate;

        return $this;
    }

    public function getEndDate(): ?\DateTimeImmutable
    {
        return $this->endDate;
    }

    public function setEndDate(?\DateTimeImmutable $endDate): static
    {
        $this->endDate = $endDate;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * @return Collection<int, Metric>|Metric[]
     */
    public function getMetrics(): Collection
    {
        return $this->metrics;
    }

    public function addMetric(Metric $metric): static
    {
        if (!$this->metrics->contains($metric)) {
            $this->metrics->add($metric);
            $metric->setCampaign($this);
        }

        return $this;
    }

    public function removeMetric(Metric $metric): static
    {
        if ($this->metrics->removeElement($metric)) {
            // set the owning side to null (unless already changed)
            if ($metric->getCampaign() === $this) {
                $metric->setCampaign(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Affiliate>|Affiliate[]
     */
    public function getAffiliates(): Collection
    {
        return $this->affiliates;
    }

    public function addAffiliate(Affiliate $affiliate): static
    {
        if (!$this->affiliates->contains($affiliate)) {
            $this->affiliates->add($affiliate);
        }

        return $this;
    }

    public function removeAffiliate(Affiliate $affiliate): static
    {
        $this->affiliates->removeElement($affiliate);

        return $this;
    }

    #[Groups(['campaign:read'])]
    public function getRevenue(): float
    {
        $totalRevenue = 0.0;
        $revenueKeywords = ['revenue', 'sales', 'income', 'profit'];
        
        foreach ($this->getMetrics() as $metric) {
            $metricName = strtolower($metric->getName());
            $metricNotes = strtolower($metric->getNotes() ?? '');
            
            foreach ($revenueKeywords as $keyword) {
                if (strpos($metricName, $keyword) !== false || strpos($metricNotes, $keyword) !== false) {
                    $totalRevenue += (float) $metric->getValue();
                    break;
                }
            }
        }
        
        return $totalRevenue;
    }

    #[Groups(['campaign:read'])]
    public function getRoi(): float
    {
        $revenue = $this->getRevenue();
        $budget = $this->getBudget();
        
        if ($budget == 0) {
            return 0.0;
        }
        
        return (($revenue - $budget) / $budget) * 100;
    }
}
