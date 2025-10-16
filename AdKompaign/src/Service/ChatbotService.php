<?php

namespace App\Service;

use App\Entity\Campaign;
use App\Repository\CampaignRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class ChatbotService
{
    private HttpClientInterface $httpClient;
    private LoggerInterface $logger;
    private string $openRouterToken;
    private EntityManagerInterface $entityManager;
    private CacheInterface $cache;
    private const OPENROUTER_MODEL = 'openai/gpt-4o-mini'; // Cost-effective and high quality

    public function __construct(
        HttpClientInterface $httpClient,
        LoggerInterface $logger,
        ParameterBagInterface $parameterBag,
        EntityManagerInterface $entityManager,
        CacheInterface $cache
    ) {
        $this->httpClient = $httpClient;
        $this->logger = $logger;
        $this->openRouterToken = $parameterBag->get('openrouter_token');
        $this->entityManager = $entityManager;
        $this->cache = $cache;
    }

    /**
     * Generate a response to a user query, optionally personalized with campaign data
     */
    public function generateResponse(string $query, ?array $campaignContext = null): string
    {
        $this->logger->info('ChatbotService: Processing query', ['query' => $query]);

        // Create unique cache key for this query and campaign context
        $campaignId = $campaignContext['campaign_id'] ?? null;
        $cacheKey = 'chatbot_response_' . md5($query . ($campaignId ?? ''));

        // Try to get cached response first
        try {
            $cachedResponse = $this->cache->get($cacheKey, function() use ($query, $campaignContext) {
                // Cache miss - generate new response
                $this->logger->info('ChatbotService: Cache miss, generating new response');

                try {
                    // Build the prompt with campaign context if provided
                    $prompt = $this->buildPrompt($query, $campaignContext);

                    // Call OpenRouter API
                    $response = $this->callOpenRouterAPI($prompt);

                    $this->logger->info('ChatbotService: Successfully generated AI response');

                    return $response;

                } catch (\Exception $e) {
                    $this->logger->error('ChatbotService: Error generating response', [
                        'error' => $e->getMessage(),
                        'query' => $query
                    ]);

                    // Fallback to mock intelligent response based on query content
                    return $this->generateFallbackResponse($query, $campaignContext);
                }
            });

            $this->logger->info('ChatbotService: Returning response (cached or fresh)');
            return $cachedResponse;

        } catch (\Exception $e) {
            $this->logger->error('ChatbotService: Cache error, falling back to direct generation', [
                'error' => $e->getMessage()
            ]);

            // Fallback if caching fails
            try {
                // Build the prompt with campaign context if provided
                $prompt = $this->buildPrompt($query, $campaignContext);

                // Call OpenRouter API
                $response = $this->callOpenRouterAPI($prompt);

                return $response;

            } catch (\Exception $apiError) {
                return $this->generateFallbackResponse($query, $campaignContext);
            }
        }
    }

    /**
     * Build a personalized prompt with campaign context
     */
    private function buildPrompt(string $query, ?array $campaignContext = null): string
    {
        $basePrompt = "You are an AI assistant specializing in advertising campaign management and ROI analysis. ";

        if ($campaignContext) {
            $basePrompt .= "You have access to the following campaign data:\n";
            $basePrompt .= json_encode($campaignContext, JSON_PRETTY_PRINT) . "\n\n";
            $basePrompt .= "Use this data to provide personalized, data-driven advice.\n\n";
        }

        $basePrompt .= "User query: {$query}\n\n";
        $basePrompt .= "Please provide a helpful, professional response:";

        return $basePrompt;
    }

    /**
     * Call OpenRouter API
     */
    private function callOpenRouterAPI(string $prompt): string
    {
        $url = "https://openrouter.ai/api/v1/chat/completions";

        $this->logger->debug('ChatbotService: Calling OpenRouter API', [
            'model' => self::OPENROUTER_MODEL,
            'prompt_length' => strlen($prompt)
        ]);

        $response = $this->httpClient->request('POST', $url, [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->openRouterToken,
                'Content-Type' => 'application/json',
                'HTTP-Referer' => 'https://adkompaign.com', // Optional: for rankings
                'X-Title' => 'AdKompaign Chatbot', // Optional: for rankings
            ],
            'json' => [
                'model' => self::OPENROUTER_MODEL,
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'max_tokens' => 500,
                'temperature' => 0.7,
                'top_p' => 0.9,
            ],
            'timeout' => 30, // 30 seconds timeout
        ]);

        $statusCode = $response->getStatusCode();
        if ($statusCode !== 200) {
            $errorData = $response->toArray(false);
            $errorMessage = $errorData['error']['message'] ?? "OpenRouter API returned status code: {$statusCode}";
            throw new \Exception($errorMessage);
        }

        $data = $response->toArray();

        // OpenRouter returns content in choices[0].message.content
        if (isset($data['choices'][0]['message']['content'])) {
            return trim($data['choices'][0]['message']['content']);
        } else {
            throw new \Exception('Unexpected response format from OpenRouter API');
        }
    }

    /**
     * Get campaign context for personalization
     */
    public function getCampaignContext(int $campaignId): ?array
    {
        $cacheKey = "chatbot_campaign_{$campaignId}";

        try {
            return $this->cache->get($cacheKey, function() use ($campaignId) {
                $this->logger->info('ChatbotService: Cache miss for campaign context, fetching from database', ['campaignId' => $campaignId]);

                $campaign = $this->entityManager->getRepository(Campaign::class)->find($campaignId);

                if (!$campaign) {
                    $this->logger->warning('ChatbotService: Campaign not found', ['campaignId' => $campaignId]);
                    return null;
                }

                // Calculate metrics from the campaign's metrics collection
                $metrics = $campaign->getMetrics();
                $totalClicks = 0;
                $totalConversions = 0;
                $totalRevenue = 0.0;
                $totalSpent = 0.0;

                foreach ($metrics as $metric) {
                    $metricName = strtolower($metric->getName());
                    $metricValue = (float) $metric->getValue();

                    // Map fixture metric names to standard categories
                    if (strpos($metricName, 'views') !== false || strpos($metricName, 'searches') !== false || strpos($metricName, 'clicks') !== false || strpos($metricName, 'impressions') !== false) {
                        $totalClicks += $metricValue;
                    } elseif (strpos($metricName, 'sales') !== false || strpos($metricName, 'orders') !== false || strpos($metricName, 'conversions') !== false || strpos($metricName, 'purchases') !== false) {
                        $totalConversions += $metricValue;
                    } elseif (strpos($metricName, 'revenue') !== false || strpos($metricName, 'income') !== false) {
                        $totalRevenue += $metricValue;
                    } elseif (strpos($metricName, 'cost') !== false || strpos($metricName, 'spend') !== false || strpos($metricName, 'spent') !== false) {
                        $totalSpent += $metricValue;
                    }
                }

                // Calculate ROI
                $roi = $totalSpent > 0 ? (($totalRevenue - $totalSpent) / $totalSpent) * 100 : 0;

                // Get affiliate names
                $affiliateNames = [];
                foreach ($campaign->getAffiliates() as $affiliate) {
                    $affiliateNames[] = $affiliate->getName();
                }

                $context = [
                    'campaign_id' => $campaign->getId(),
                    'name' => $campaign->getName(),
                    'budget' => $campaign->getBudget(),
                    'status' => $campaign->getStatus(),
                    'affiliates' => $affiliateNames,
                    'current_metrics' => [
                        'clicks' => $totalClicks,
                        'conversions' => $totalConversions,
                        'revenue' => $totalRevenue,
                        'cost' => $totalSpent,
                    ],
                    'roi_calculation' => [
                        'total_spent' => $totalSpent,
                        'total_revenue' => $totalRevenue,
                        'roi_percentage' => round($roi, 2),
                        'status' => $roi >= 0 ? 'profit' : 'loss',
                    ],
                ];

                $this->logger->info('ChatbotService: Campaign context cached', ['campaignId' => $campaignId]);
                return $context;
            });

        } catch (\Exception $e) {
            $this->logger->error('ChatbotService: Error fetching campaign context', [
                'campaignId' => $campaignId,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Generate intelligent fallback responses when AI service is unavailable
     */
    private function generateFallbackResponse(string $query, ?array $campaignContext = null): string
    {
        if ($campaignContext) {
            $campaignName = $campaignContext['name'] ?? 'your campaign';
            $budget = $campaignContext['budget'] ?? 0;
            $metrics = $campaignContext['current_metrics'] ?? [];
            $roi = $campaignContext['roi_calculation']['roi_percentage'] ?? 0;
            
            return "I apologize, but I'm currently unable to access the AI service. However, based on your **{$campaignName}** campaign data (Budget: $" . number_format($budget, 2) . ", ROI: " . number_format($roi, 2) . "%), I can see you have active performance metrics. Please try your question again in a moment, or contact support if the issue persists.";
        }
        
        return "I apologize, but I'm currently unable to process your request due to a technical issue. Please try again in a moment.";
    }
}