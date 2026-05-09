<?php

namespace App\Http\Controllers\API\Tenant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\House;
use App\Models\CompareList;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;

class CompareController extends Controller
{
    /**
     * Get all properties in compare list for authenticated user
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        
        $compareRecords = CompareList::where('user_id', $userId)
            ->with(['property' => function ($query) {
                $query->with(['housePhotos', 'rentals', 'amenties', 'furnitures']);
            }])
            ->orderBy('created_at', 'desc')
            ->get();
        
        $properties = $compareRecords->map->property;
        $compareIds = $compareRecords->pluck('property_id')->toArray();

        return response()->json([
            'status' => true,
            'data' => $properties,
            'compare_ids' => $compareIds,
        ]);
    }

    /**
     * Add property to compare list
     */
    public function store(Request $request, $propertyId): JsonResponse
    {
        $userId = $request->user()->id;
        
        Log::info('Compare store attempt', [
            'user_id' => $userId,
            'propertyId' => $propertyId,
        ]);

        // Check if property exists
        $property = House::find($propertyId);
        if (!$property) {
            Log::warning('Property not found', ['propertyId' => $propertyId]);
            return response()->json([
                'status' => false,
                'message' => 'Property not found'
            ], 404);
        }

        // Check if already in compare list
        $exists = CompareList::where('user_id', $userId)
            ->where('property_id', $propertyId)
            ->exists();

        if ($exists) {
            Log::info('Property already in compare list', [
                'user_id' => $userId,
                'propertyId' => $propertyId
            ]);
            $count = CompareList::where('user_id', $userId)->count();
            return response()->json([
                'status' => true,
                'message' => 'Property already in compare list',
                'compare_count' => $count
            ]);
        }

        // Check limit before adding
        $count = CompareList::where('user_id', $userId)->count();
        Log::info('Current compare count', ['user_id' => $userId, 'count' => $count]);
        if ($count >= 4) {
            return response()->json([
                'status' => false,
                'message' => 'Maximum 4 properties allowed for comparison',
                'code' => 'MAX_LIMIT_REACHED'
            ], 400);
        }

        try {
            CompareList::create([
                'user_id' => $userId,
                'property_id' => $propertyId,
            ]);
            Log::info('Property added to compare', ['user_id' => $userId, 'propertyId' => $propertyId]);
        } catch (QueryException $e) {
            // Handle duplicate entry (race condition)
            if ($e->getCode() === '23000') {
                Log::warning('Duplicate compare entry (race)', [
                    'user_id' => $userId,
                    'propertyId' => $propertyId
                ]);
                // It's already there, treat as success
                $count = CompareList::where('user_id', $userId)->count();
                return response()->json([
                    'status' => true,
                    'message' => 'Property already in compare list',
                    'compare_count' => $count
                ]);
            }
            Log::error('Failed to create CompareList', [
                'error' => $e->getMessage(),
                'user_id' => $userId,
                'propertyId' => $propertyId
            ]);
            return response()->json([
                'status' => false,
                'message' => 'Failed to add property: ' . $e->getMessage()
            ], 500);
        }

        $newCount = CompareList::where('user_id', $userId)->count();

        return response()->json([
            'status' => true,
            'message' => 'Property added to compare list',
            'compare_count' => $newCount
        ]);
    }

    /**
     * Remove property from compare list
     */
    public function destroy(Request $request, $propertyId): JsonResponse
    {
        $userId = $request->user()->id;
        
        $deleted = CompareList::where('user_id', $userId)
            ->where('property_id', $propertyId)
            ->delete();

        if (!$deleted) {
            return response()->json([
                'status' => false,
                'message' => 'Property not in compare list'
            ], 404);
        }

        $newCount = CompareList::where('user_id', $userId)->count();

        return response()->json([
            'status' => true,
            'message' => 'Property removed from compare list',
            'compare_count' => $newCount
        ]);
    }

    /**
     * Clear all properties from compare list
     */
    public function clear(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        
        CompareList::where('user_id', $userId)->delete();

        return response()->json([
            'status' => true,
            'message' => 'Compare list cleared'
        ]);
    }
}
