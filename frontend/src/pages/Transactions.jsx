import { useEffect, useState } from 'react';
import api from '../api/axios';
import { 
  Plus, Search, Filter, Trash2, Edit2, Calendar, ArrowUpCircle, ArrowDownCircle, Loader2, X
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category_id: '',
    type: '',
    start_date: '',
    end_date: '',
  });

  const fetchTransactions = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.category_id) params.append('category_id', filters.category_id);
    if (filters.type) params.append('type', filters.type);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);

    api.get(`/transactions?${params.toString()}`)
      .then(res => setTransactions(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTransactions();
    api.get('/categories').then(res => setCategories(res.data));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.delete(`/transactions/${id}`);
        setTransactions(transactions.filter(t => t.id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const clearFilters = () => {
    setFilters({
      category_id: '',
      type: '',
      start_date: '',
      end_date: '',
    });
    // Need to trigger fetch manually or use useEffect dependency
  };

  // Re-fetch when filters change (debounced would be better but for now simple button search)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Transactions</h1>
          <p className="text-slate-500">View and manage all your financial activities.</p>
        </div>
        <Link to="/transactions/new" className="btn-primary flex items-center space-x-2 shadow-lg shadow-primary-200">
          <Plus className="w-4 h-4" />
          <span>Add Transaction</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="card border-none shadow-xl shadow-slate-100 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Type</label>
            <select 
              className="input-field text-sm"
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Category</label>
            <select 
              className="input-field text-sm"
              value={filters.category_id}
              onChange={(e) => setFilters({...filters, category_id: e.target.value})}
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">From Date</label>
            <input 
              type="date"
              className="input-field text-sm"
              value={filters.start_date}
              onChange={(e) => setFilters({...filters, start_date: e.target.value})}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">To Date</label>
            <input 
              type="date"
              className="input-field text-sm"
              value={filters.end_date}
              onChange={(e) => setFilters({...filters, end_date: e.target.value})}
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={fetchTransactions}
              className="flex-1 btn-primary py-2.5 flex justify-center items-center h-[42px]"
            >
              <Search className="w-4 h-4 mr-2" />
              <span>Search</span>
            </button>
             <button 
              onClick={clearFilters}
              className="p-2.5 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors h-[42px]"
              title="Clear Filters"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="card border-none shadow-xl shadow-slate-200/50 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center flex flex-col items-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary-600 mb-4" />
            <p className="text-slate-500 font-medium">Filtering transactions...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.1em]">
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Label & Category</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5">Amount</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {transactions.length > 0 ? (
                  transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        {t.type === 'income' ? (
                          <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full w-fit">
                            <ArrowUpCircle className="w-5 h-5" />
                          </div>
                        ) : (
                          <div className="bg-rose-100 text-rose-600 p-2 rounded-full w-fit">
                            <ArrowDownCircle className="w-5 h-5" />
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold text-slate-700 group-hover:text-primary-600 transition-colors">{t.description || 'Quick Transaction'}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{t.category.name}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center text-sm text-slate-400 font-medium">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`text-base font-black ${
                          t.type === 'income' ? 'text-emerald-500' : 'text-slate-900'
                        }`}>
                          {t.type === 'income' ? '+' : '-'}${parseFloat(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link 
                            to={`/transactions/${t.id}/edit`} 
                            className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(t.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <div className="bg-slate-100 p-4 rounded-full mb-4">
                           <Search className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-bold">No transactions found</p>
                        <p className="text-slate-400 text-sm">Try adjusting your filters or add a new entry.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
