<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\Controller\ChatbotController;
use App\Dto\ChatbotRequest;
use App\Dto\ChatbotResponse;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/chatbot/query',
            controller: ChatbotController::class,
            input: ChatbotRequest::class,
            output: ChatbotResponse::class,
            normalizationContext: ['groups' => ['chatbot:read']],
            denormalizationContext: ['groups' => ['chatbot:write']],
            name: 'chatbot_query'
        ),
    ],
    normalizationContext: ['groups' => ['chatbot:read']],
    denormalizationContext: ['groups' => ['chatbot:write']]
)]
class Chatbot
{
    // This is a virtual resource - no actual entity
    // Used only for API Platform routing
}