import React, { useState, useEffect } from 'react';
import { Search, Plus, ArrowLeft, Save, Trash2, Edit2, X, AlertTriangle, Building, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Empresa {
  id: string;
  nome_fantasia: string;
  cnpj: string;
  regime_tributario: string;
  impostos: number;
  status: 'Ativo' | 'Inativo';
}

export default function Empresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingItem, setEditingItem] = useState<Empresa | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEmpresas();
  }, []);

  async function fetchEmpresas() {
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase.from('empresas').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setEmpresas(data);
    } catch (err) {
      console.error('Erro ao buscar empresas:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    
    const formData = new FormData(e.currentTarget);
    const empresaData = {
      nome_fantasia: formData.get('nome_fantasia') as string,
      cnpj: formData.get('cnpj') as string,
      regime_tributario: formData.get('regime_tributario') as string,
      impostos: Number(formData.get('impostos')),
      status: formData.get('status') as 'Ativo' | 'Inativo',
    };

    try {
      if (editingItem) {
        const { error } = await supabase.from('empresas').update(empresaData).eq('id', editingItem.id);
        if (error) throw error;
        setEmpresas(empresas.map(emp => emp.id === editingItem.id ? { ...emp, ...empresaData } as Empresa : emp));
      } else {
        const { data, error } = await supabase.from('empresas').insert([empresaData]).select();
        if (error) throw error;
        if (data && data.length > 0) {
          setEmpresas([data[0], ...empresas]);
        }
      }
      setView('list');
    } catch (err: any) {
      console.error('Erro ao salvar empresa:', err);
      alert(err.message || 'Ocorreu um erro ao salvar a empresa.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!supabase || !deleteModalId) return;
    try {
      const { error } = await supabase.from('empresas').delete().eq('id', deleteModalId);
      if (error) throw error;
      setEmpresas(empresas.filter(emp => emp.id !== deleteModalId));
      setDeleteModalId(null);
    } catch (err) {
      console.error('Erro ao excluir empresa:', err);
      alert('Erro ao excluir a empresa. Pode estar vinculada a outros registros.');
    }
  };

  if (view === 'form') {
    return (
      <div className="flex flex-col gap-6 w-full pb-8">
        <form onSubmit={handleSave} className="flex flex-col gap-6 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setView('list')} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors">
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-800">{editingItem ? 'Editar Empresa' : 'Nova Empresa'}</h1>
                <p className="text-sm text-slate-500 mt-1">Configure os dados cadastrais da empresa/filial.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setView('list')} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Cancelar</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Salvar Empresa
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 flex items-center gap-4 mb-2">
               <div className="w-20 h-20 bg-slate-100 border border-slate-200 border-dashed rounded-lg flex items-center justify-center text-slate-400">
                  <ImageIcon size={24} />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Logomarca (Opcional)</label>
                  <input type="file" accept="image/*" className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
               </div>
            </div>
             <div className="space-y-2">
               <label className="text-sm font-medium text-slate-700">Nome da Empresa (Razão/Fantasia)</label>
               <input required name="nome_fantasia" type="text" defaultValue={editingItem?.nome_fantasia} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium text-slate-700">CNPJ</label>
               <input required name="cnpj" type="text" defaultValue={editingItem?.cnpj} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium text-slate-700">Regime Tributário</label>
               <select name="regime_tributario" defaultValue={editingItem?.regime_tributario || 'Simples Nacional'} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Simples Nacional">Simples Nacional</option>
                  <option value="Lucro Presumido">Lucro Presumido</option>
                  <option value="Lucro Real">Lucro Real</option>
               </select>
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium text-slate-700">Impostos Previstos (%)</label>
               <input required name="impostos" type="number" step="0.01" defaultValue={editingItem?.impostos} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium text-slate-700">Status</label>
               <select name="status" defaultValue={editingItem?.status || 'Ativo'} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
               </select>
             </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Cadastro de Empresas</h1>
          <p className="text-slate-500 text-sm mt-1">Gerencie os dados das suas empresas para emissão de pedidos e financeiro.</p>
        </div>
        <button onClick={() => { setEditingItem(null); setView('form'); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
          <Plus size={16} /> Nova Empresa
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Buscar empresa..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-8 flex justify-center text-slate-400"><Loader2 className="animate-spin" /></div>
          ) : empresas.length === 0 ? (
             <div className="p-8 text-center text-slate-500">Nenhuma empresa encontrada.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Empresa</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">CNPJ</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tributação (Impostos)</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {empresas.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                          <Building size={16} />
                        </div>
                        <p className="font-medium text-slate-900">{item.nome_fantasia}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm font-mono">{item.cnpj}</td>
                    <td className="px-6 py-4">
                       <div className="flex flex-col">
                          <span className="text-sm text-slate-700 font-medium">{item.regime_tributario}</span>
                          <span className="text-xs text-slate-500">{item.impostos}% de impostos no faturamento</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                         item.status === 'Ativo' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-700 border-slate-200'
                       }`}>
                         {item.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingItem(item); setView('form'); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Editar"><Edit2 size={16} /></button>
                          <button onClick={() => setDeleteModalId(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded" title="Excluir"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {deleteModalId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-start justify-between mb-5">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0"><AlertTriangle size={20} /></div>
                 <h3 className="text-lg font-semibold text-slate-900">Excluir Empresa</h3>
               </div>
               <button onClick={() => setDeleteModalId(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <p className="text-sm text-slate-600 mb-6">Atenção! Remover esta empresa pode causar perda de histórico financeiro.</p>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button onClick={() => setDeleteModalId(null)} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">Cancelar</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Sim, excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
