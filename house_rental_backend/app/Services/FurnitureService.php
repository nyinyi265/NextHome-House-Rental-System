<?php

namespace App\Services;

use App\Models\Furniture;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class FurnitureService
{
    public function list()
    {
        return Furniture::all();
    }

    public function find(int $id): Furniture
    {
        return Furniture::findOrFail($id);
    }

    public function create(array $data): Furniture
    {
        return Furniture::create($data);
    }

    public function update(int $id, array $data): Furniture
    {
        $furniture = $this->find($id);
        $furniture->update($data);
        return $furniture;
    }

    public function delete(int $id): void
    {
        $furniture = $this->find($id);
        $furniture->delete();
    }
}
