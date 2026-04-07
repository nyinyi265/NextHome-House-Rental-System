<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMessageRequest;
use App\Http\Responses\MessageResponse;
use App\Services\MessageService;
use App\Traits\HttpResponse;

class MessageController extends Controller
{
    use HttpResponse;
    protected $messageService;
    public function __construct(MessageService $messageService)
    {
        $this->messageService = $messageService;
    }

    public function store(StoreMessageRequest $request)
    {
        $message = $this->messageService->create($request->all());
        return $this->success('success', MessageResponse::created($message), 'Message created successfully', 201);
    }

    public function index()
    {
        $messages = $this->messageService->list();
        return $this->success('success', MessageResponse::list($messages), 'Messages retrieved successfully', 200);
    }
}
