<?php

namespace App\Services;

use App\Models\Message;

class MessageService
{
    /**
     * Create a new service instance.
     */
    public function __construct()
    {
        //
    }

    public function create(array $data)
    {
        return Message::create($data);
    }

    public function list()
    {
        return Message::all();
    }
}
