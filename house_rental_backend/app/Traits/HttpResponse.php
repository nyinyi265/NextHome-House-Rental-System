<?php

namespace App\Traits;

trait HttpResponse
{
    public function success($status, $data, $message, $code)
    {
        return response()->json([
            'status' => $status,
            'statusCode' => $code,
            'data' => $data,
            'message' => $message,
        ], $code);
    }

    public function fail($status, $data, $message, $code)
    {
        return response()->json([
            'status' => $status,
            'statusCode' => $code,
            'data' => $data,
            'message' => $message,
        ], $code);
    }
}
