<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Salary', 'type' => 'income', 'icon' => 'Wallet', 'color' => '#10b981'],
            ['name' => 'Freelance', 'type' => 'income', 'icon' => 'Code', 'color' => '#34d399'],
            ['name' => 'Investments', 'type' => 'income', 'icon' => 'TrendingUp', 'color' => '#059669'],
            ['name' => 'Shopping', 'type' => 'expense', 'icon' => 'ShoppingBag', 'color' => '#f43f5e'],
            ['name' => 'Food & Dining', 'type' => 'expense', 'icon' => 'Utensils', 'color' => '#e11d48'],
            ['name' => 'Rent', 'type' => 'expense', 'icon' => 'Home', 'color' => '#be123c'],
            ['name' => 'Utilities', 'type' => 'expense', 'icon' => 'Zap', 'color' => '#fb7185'],
            ['name' => 'Transportation', 'type' => 'expense', 'icon' => 'Car', 'color' => '#fda4af'],
            ['name' => 'Entertainment', 'type' => 'expense', 'icon' => 'Tv', 'color' => '#fbbf24'],
        ];

        foreach ($categories as $category) {
            DB::table('categories')->insert(array_merge($category, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
