<?php

namespace App\Http\Controllers\API\Tenant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Notification;
use Laravel\Sanctum\PersonalAccessToken;
use Symfony\Component\HttpFoundation\StreamedResponse;

class NotificationSSEController extends Controller
{
    /**
     * Stream notifications via Server-Sent Events.
     */
    public function stream(Request $request): StreamedResponse
    {
        $lastId = (int) $request->query('last_id', 0);
        $token = $request->query('token');

        // Validate token using Sanctum
        $tokenRecord = PersonalAccessToken::where('token', hash('sha256', $token))
            ->where('tokenable_type', 'App\Models\User')
            ->first();

        if (!$tokenRecord) {
            abort(401, 'Unauthorized');
        }

        $userId = $tokenRecord->tokenable_id;

        $callback = function () use ($userId, &$lastId) {
            // Disable time limit for long-running script
            set_time_limit(0);

            // Clear output buffers and disable buffering
            while (ob_get_level() > 0) {
                ob_end_flush();
            }
            ob_implicit_flush(true);

            // Set headers for SSE
            header('Content-Type: text/event-stream');
            header('Cache-Control: no-cache');
            header('Connection: keep-alive');
            header('X-Accel-Buffering: no');
            header('Access-Control-Allow-Origin: *');

            // Send initial comment to keep connection alive
            echo ": connected\n\n";

            // Keep connection open and check for new notifications every 1 second
            while (true) {
                // Check if client disconnected
                if (connection_aborted()) {
                    break;
                }

                // Send keep-alive comment every iteration
                echo ": ping " . time() . "\n\n";

                // Small delay to ensure DB transactions are committed
                usleep(100000); // 100ms

                $newNotifications = Notification::where('user_id', $userId)
                    ->where('id', '>', $lastId)
                    ->orderBy('id', 'asc')
                    ->get();

                if ($newNotifications->count() > 0) {
                    foreach ($newNotifications as $notification) {
                        $lastId = $notification->id;
                        $data = [
                            'id' => $notification->id,
                            'message' => $notification->message,
                            'type' => $notification->type,
                            'url' => $notification->url,
                            'read_at' => $notification->read_at,
                            'created_at' => $notification->created_at,
                        ];
                        echo "event: notification\n";
                        echo "id: " . $notification->id . "\n";
                        echo "data: " . json_encode($data) . "\n\n";
                    }
                    flush();
                }

                sleep(1);
            }
        };

        return response()->stream($callback, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no',
            'Access-Control-Allow-Origin' => '*',
        ]);
    }
}
