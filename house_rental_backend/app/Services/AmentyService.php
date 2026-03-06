<?php

namespace App\Services;

use App\Models\Amenty;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class AmentyService
{
    public function list()
    {
        return Amenty::all();
    }

    public function find(int $id): Amenty
    {
        return Amenty::findOrFail($id);
    }

    public function create(array $data): Amenty
    {
        return Amenty::create($data);
    }

    public function update(int $id, array $data): Amenty
    {
        $amenty = $this->find($id);
        $amenty->update($data);
        return $amenty;
    }

    public function delete(int $id): void
    {
        $amenty = $this->find($id);
        $amenty->delete();
    }
}
