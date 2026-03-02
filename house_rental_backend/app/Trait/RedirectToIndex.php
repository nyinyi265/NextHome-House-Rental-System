<?php

namespace App\Trait;

trait RedirectToIndex
{
    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
