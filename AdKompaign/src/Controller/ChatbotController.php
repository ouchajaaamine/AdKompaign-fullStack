<?php

namespace App\Controller;

use App\Dto\ChatbotRequest;
use App\Dto\ChatbotResponse;
use App\Service\ChatbotService;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[AsController]
#[Route('/api/chatbot', name: 'chatbot', methods: ['POST'])]
class ChatbotController
{
    public function __construct(
        private ChatbotService $chatbotService,
        private LoggerInterface $logger,
        private SerializerInterface $serializer
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        // Deserialize the request body into ChatbotRequest DTO
        $chatbotRequest = $this->serializer->deserialize(
            $request->getContent(),
            ChatbotRequest::class,
            'json'
        );

        $this->logger->info('ChatbotController: Received query', [
            'query' => $chatbotRequest->query,
            'campaignId' => $chatbotRequest->campaignId
        ]);

        try {
            // Get campaign context if campaignId is provided
            $campaignContext = null;
            if ($chatbotRequest->campaignId !== null) {
                $campaignContext = $this->chatbotService->getCampaignContext($chatbotRequest->campaignId);
                $this->logger->info('ChatbotController: Loaded campaign context', [
                    'campaignId' => $chatbotRequest->campaignId,
                    'context' => $campaignContext
                ]);
            }

            // Generate AI response
            $aiResponse = $this->chatbotService->generateResponse(
                $chatbotRequest->query,
                $campaignContext
            );

            $this->logger->info('ChatbotController: Successfully generated response', [
                'responseLength' => strlen($aiResponse)
            ]);

            $response = new ChatbotResponse($aiResponse, $chatbotRequest->campaignId);
            return new JsonResponse([
                'response' => $response->response,
                'campaignId' => $response->campaignId
            ]);

        } catch (\Exception $e) {
            $this->logger->error('ChatbotController: Error processing request', [
                'error' => $e->getMessage(),
                'query' => $chatbotRequest->query,
                'campaignId' => $chatbotRequest->campaignId
            ]);

            // Return error response
            $errorResponse = new ChatbotResponse(
                'I apologize, but I encountered an error while processing your request. Please try again later.',
                $chatbotRequest->campaignId
            );
            return new JsonResponse([
                'response' => $errorResponse->response,
                'campaignId' => $errorResponse->campaignId
            ], 500);
        }
    }
}