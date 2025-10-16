<?php

namespace App\Controller;

use App\Dto\RoiResponse;
use App\Entity\Campaign;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class RoiController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private LoggerInterface $logger
    ) {}

    public function __invoke(int $id)
    {
        $this->logger->info('RoiController invoked with ID: ' . $id);
        
        $campaign = $this->entityManager->getRepository(Campaign::class)->find($id);
        
        if (!$campaign) {
            $this->logger->error('Campaign not found with ID: ' . $id);
            throw $this->createNotFoundException('Campaign not found');
        }

        $this->logger->info('Campaign found: ' . $campaign->getName());

        // Calculate ROI based on metrics
        $totalSpent = $campaign->getBudget();
        $this->logger->info('Total spent (budget): ' . $totalSpent);
        
        // Calculate total revenue from metrics containing revenue-related keywords
        $totalRevenue = 0.0;
        $revenueKeywords = ['revenue', 'sales', 'income', 'profit'];
        
        foreach ($campaign->getMetrics() as $metric) {
            $metricName = strtolower($metric->getName());
            $metricNotes = strtolower($metric->getNotes() ?? '');
            
            // Check if metric name or notes contain revenue keywords
            foreach ($revenueKeywords as $keyword) {
                if (strpos($metricName, $keyword) !== false || strpos($metricNotes, $keyword) !== false) {
                    $totalRevenue += (float) $metric->getValue();
                    $this->logger->info("Added revenue from metric: {$metric->getName()} = {$metric->getValue()}");
                    break; // Only count once per metric
                }
            }
        }
        
        $this->logger->info('Total revenue calculated: ' . $totalRevenue);

        $roi = $totalSpent > 0 ? (($totalRevenue - $totalSpent) / $totalSpent) * 100 : 0;
        $this->logger->info('Calculated ROI: ' . $roi);

        $roiResponse = new RoiResponse(
            campaignId: $id,
            campaignName: $campaign->getName(),
            budget: $totalSpent,
            totalRevenue: $totalRevenue,
            roiPercentage: round($roi, 2),
            status: $roi > 0 ? 'profitable' : 'loss',
            calculatedAt: (new \DateTimeImmutable())->format('Y-m-d H:i:s')
        );

        return $this->json($roiResponse);
    }
}