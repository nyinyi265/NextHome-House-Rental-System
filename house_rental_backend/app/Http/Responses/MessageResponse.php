<?php

namespace App\Http\Responses;

use App\Models\Message;

class MessageResponse
{
    public static function list($messages): array
    {
        return ['messages' => $messages];
    }

    public static function single(Message $message): array
    {
        return ['message' => $message];
    }

    public static function created(Message $message): array
    {
        return ['message' => $message];
    }
}
