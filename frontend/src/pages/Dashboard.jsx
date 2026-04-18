import { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
  TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon, 
  ArrowUpRight, ArrowDownRight, Plus, Calendar, Loader2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
        <p className="text-slate-500 animate-pulse">Loading your financial summary...</p>
      </div>
    );
  }

  if (!data) return <div className="p-8 text-center text-red-500">Error loading dashboard data.</div>;

  const COLORS = ['#0ea5e9', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Overview</h1>
          <p className="text-slate-500">Track your income and expenses at a glance.</p>
        </div>
        <div className="flex gap-3">
           <Link to="/transactions/new" className="btn-primary flex items-center space-x-2 shadow-lg shadow-primary-200">
            <Plus className="w-4 h-4" />
            <span>New Transaction</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 bg-gradient-to-br from-white to-slate-50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Total Balance</span>
            <div className="bg-primary-50 p-2.5 rounded-xl text-primary-600">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900">${data.summary.balance.toLocaleString()}</div>
          <div className="mt-4 flex items-center text-sm">
             <span className="text-slate-400">Current available funds</span>
          </div>
        </div>
        
        <div className="card p-6 border-l-4 border-l-emerald-500 bg-gradient-to-br from-white to-emerald-50/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Total Income</span>
            <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="text-4xl font-black text-emerald-600">${data.summary.total_income.toLocaleString()}</div>
          <div className="mt-4 flex items-center text-sm text-emerald-600 font-medium">
             <ArrowUpRight className="w-4 h-4 mr-1" />
             <span>All recorded income</span>
          </div>
        </div>

        <div className="card p-6 border-l-4 border-l-rose-500 bg-gradient-to-br from-white to-rose-50/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Total Expense</span>
            <div className="bg-rose-50 p-2.5 rounded-xl text-rose-600">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>
          <div className="text-4xl font-black text-rose-600">${data.summary.total_expense.toLocaleString()}</div>
          <div className="mt-4 flex items-center text-sm text-rose-600 font-medium">
             <ArrowDownRight className="w-4 h-4 mr-1" />
             <span>All recorded expenses</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Cash Flow History</h3>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center"><div className="w-3 h-3 bg-emerald-500 rounded-full mr-1.5"></div> Income</div>
              <div className="flex items-center"><div className="w-3 h-3 bg-rose-500 rounded-full mr-1.5"></div> Expense</div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthly_data}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'}}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={3} />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-8">Spending Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.expenses_by_category}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="total"
                  nameKey="category.name"
                  stroke="none"
                >
                  {data.expenses_by_category.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'}}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card border-none shadow-xl shadow-slate-200/50">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white rounded-t-2xl">
          <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
          <Link to="/transactions" className="text-primary-600 text-sm font-bold hover:text-primary-700 underline decoration-primary-200 underline-offset-4">
            View Statement
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.1em] font-black">
                <th className="px-8 py-4">Transaction Details</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4">Date</th>
                <th className="px-8 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 bg-white">
              {data.recent_transactions.length > 0 ? (
                data.recent_transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-slate-700 group-hover:text-primary-600 transition-colors">{t.description || 'General Transaction'}</div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {t.category.name}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center text-sm text-slate-400 font-medium">
                        <Calendar className="w-3.5 h-3.5 mr-2 opacity-50" />
                        {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right font-black">
                      <div className={`text-base ${
                        t.type === 'income' ? 'text-emerald-500' : 'text-slate-900'
                      }`}>
                        {t.type === 'income' ? '+' : '-'}${parseFloat(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-12 text-center text-slate-400 font-medium italic">
                    No transactions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
