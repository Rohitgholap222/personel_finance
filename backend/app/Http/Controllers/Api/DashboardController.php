<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $totalIncome = $user->transactions()->where('type', 'income')->sum('amount');
        $totalExpense = $user->transactions()->where('type', 'expense')->sum('amount');
        $balance = $totalIncome - $totalExpense;

        $recentTransactions = $user->transactions()->with('category')->orderBy('date', 'desc')->limit(5)->get();

        $expensesByCategory = $user->transactions()
            ->where('type', 'expense')
            ->select('category_id', DB::raw('sum(amount) as total'))
            ->groupBy('category_id')
            ->with('category')
            ->get();

        $monthlyData = $user->transactions()
            ->select(
                DB::raw('DATE_FORMAT(date, "%Y-%m") as month'),
                DB::raw('SUM(CASE WHEN type = "income" THEN amount ELSE 0 END) as income'),
                DB::raw('SUM(CASE WHEN type = "expense" THEN amount ELSE 0 END) as expense')
            )
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        return response()->json([
            'summary' => [
                'total_income' => (float)$totalIncome,
                'total_expense' => (float)$totalExpense,
                'balance' => (float)$balance,
            ],
            'recent_transactions' => $recentTransactions,
            'expenses_by_category' => $expensesByCategory,
            'monthly_data' => $monthlyData,
        ]);
    }
}
