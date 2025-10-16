<?php

namespace App\Dto;

use Symfony\Component\Serializer\Annotation\Groups;

final class ChatbotResponse
{
    #[Groups(['chatbot:read'])]
    public string $response;

    #[Groups(['chatbot:read'])]
    public string $timestamp;

    #[Groups(['chatbot:read'])]
    public ?int $campaignId = null;

    public function __construct(string $response, ?int $campaignId = null)
    {
        $this->response = $response;
        $this->timestamp = (new \DateTimeImmutable())->format('c'); // ISO 8601 format
        $this->campaignId = $campaignId;
    }
}