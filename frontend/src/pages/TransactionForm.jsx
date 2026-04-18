import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Save, PlusCircle, MinusCircle } from 'lucide-react';

const TransactionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category_id: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        const catRes = await api.get('/categories');
        const allCategories = catRes.data;
        setCategories(allCategories);

        if (id) {
          const transRes = await api.get(`/transactions/${id}`);
          setFormData({
            amount: transRes.data.amount,
            type: transRes.data.type,
            category_id: transRes.data.category_id,
            date: transRes.data.date,
            description: transRes.data.description || '',
          });
        } else if (allCategories.length > 0) {
          // Initialize with first expense category if none selected
          const firstExp = allCategories.find(c => c.type === 'expense');
          if (firstExp) setFormData(prev => ({ ...prev, category_id: firstExp.id }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id]);

  // Update category when type changes if current category is incompatible
  useEffect(() => {
    if (categories.length > 0) {
      const currentCat = categories.find(c => c.id == formData.category_id);
      if (currentCat && currentCat.type !== formData.type) {
        const firstOfNewType = categories.find(c => c.type === formData.type);
        if (firstOfNewType) setFormData(prev => ({ ...prev, category_id: firstOfNewType.id }));
      }
    }
  }, [formData.type, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await api.put(`/transactions/${id}`, formData);
      } else {
        await api.post('/transactions', formData);
      }
      navigate('/transactions');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
        <p className="text-slate-500">Loading details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center space-x-4">
        <Link to="/transactions" className="p-2.5 bg-white shadow-sm border border-slate-100 rounded-xl transition-all text-slate-400 hover:text-primary-600 hover:border-primary-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{id ? 'Edit Transaction' : 'New Transaction'}</h1>
          <p className="text-slate-500">{id ? 'Update your record details' : 'Record a new income or expense'}</p>
        </div>
      </div>

      <div className="card border-none shadow-2xl shadow-slate-200/60 p-10 bg-white">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Transaction Flow</label>
              <div className="grid grid-cols-2 gap-4 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                <button
                  type="button"
                  className={`flex items-center justify-center gap-2 py-3.5 text-sm font-black uppercase tracking-wider rounded-xl transition-all ${
                    formData.type === 'expense' 
                      ? 'bg-white text-rose-500 shadow-lg shadow-rose-100 border border-rose-50' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  onClick={() => setFormData({ ...formData, type: 'expense' })}
                >
                  <MinusCircle className="w-5 h-5" />
                  Expense
                </button>
                <button
                  type="button"
                  className={`flex items-center justify-center gap-2 py-3.5 text-sm font-black uppercase tracking-wider rounded-xl transition-all ${
                    formData.type === 'income' 
                      ? 'bg-white text-emerald-500 shadow-lg shadow-emerald-100 border border-emerald-50' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  onClick={() => setFormData({ ...formData, type: 'income' })}
                >
                  <PlusCircle className="w-5 h-5" />
                  Income
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Value Amount</label>
                <div className="relative group">
                  <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-black text-xl transition-colors ${
                    formData.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>$</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full pl-10 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-xl font-black text-slate-800 transition-all focus:bg-white focus:border-primary-500 focus:outline-none"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Activity Date</label>
                <div className="relative">
                   <input
                    type="date"
                    required
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-800 transition-all focus:bg-white focus:border-primary-500 focus:outline-none"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Classification Category</label>
              <select
                required
                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-800 transition-all focus:bg-white focus:border-primary-500 focus:outline-none appearance-none"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              >
                {categories.filter(c => c.type === formData.type).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Narration / Note</label>
              <textarea
                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl font-medium text-slate-800 transition-all focus:bg-white focus:border-primary-500 focus:outline-none min-h-[120px] resize-none"
                placeholder="Briefly describe this transaction..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 flex justify-center items-center text-sm font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all ${
                 formData.type === 'income' 
                  ? 'bg-emerald-500 text-white shadow-emerald-200 hover:bg-emerald-600' 
                  : 'bg-primary-600 text-white shadow-primary-200 hover:bg-primary-700'
              }`}
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  <Save className="w-5 h-5 mr-3" />
                  <span>{id ? 'Apply Modifications' : 'Confirm Transaction'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
