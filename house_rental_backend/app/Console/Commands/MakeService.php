<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class MakeService extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:service {name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'To create a new service class';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $name = $this->argument('name');

        // Support nested folders like Payment/StripeService
        $name = str_replace('\\', '/', $name);

        $className = class_basename($name);
        $directory = dirname($name);

        $basePath = app_path('Services');
        $servicePath = $directory === '.'
            ? $basePath
            : $basePath . '/' . $directory;

        $filePath = $servicePath . '/' . $className . '.php';

        if (File::exists($filePath) && !$this->option('force')) {
            $this->error('Service already exists! Use --force to overwrite.');
            return;
        }

        // Create directory if not exists
        File::ensureDirectoryExists($servicePath);

        // Get stub content
        $stub = File::get(base_path('stubs/service.stub'));

        $namespace = 'App\\Services';

        if ($directory !== '.') {
            $namespace .= '\\' . str_replace('/', '\\', $directory);
        }

        // Replace stub variables
        $stub = str_replace('{{ namespace }}', $namespace, $stub);
        $stub = str_replace('{{ class }}', $className, $stub);

        File::put($filePath, $stub);

        $this->info("Service created successfully: {$filePath}");
    }
}
