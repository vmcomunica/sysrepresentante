import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, Eye, ArrowLeft, Save, X, AlertTriangle, MoreHorizontal, Loader2 } from 'lucide-react';
export interface Cliente {
  id: string;
  razao_social: string;
  cnpj: string;
  cidade: string;
  estado: string;
  status: string;
}
import { supabase } from '../lib/supabase';

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingItem, setEditingItem] = useState<Cliente | null>(null);
  const [activeTab, setActiveTab] = useState('principais');
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  useEffect(() => {
    fetchClientes();
  }, []);

  async function fetchClientes() {
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase.from('clientes').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setClientes(data);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreate = () => {
    setEditingItem(null);
    setActiveTab('principais');
    setView('form');
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingItem(cliente);
    setActiveTab('principais');
    setView('form');
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    
    const formData = new FormData(e.currentTarget);
    const clienteData = {
      razao_social: formData.get('razao_social') as string,
      cnpj: formData.get('cnpj') as string,
      status: formData.get('status') as string,
      cidade: formData.get('cidade') as string,
      estado: formData.get('estado') as string,
    };

    try {
      if (editingItem) {
        const { error } = await supabase.from('clientes').update(clienteData).eq('id', editingItem.id);
        if (error) throw error;
        setClientes(clientes.map(c => c.id === editingItem.id ? { ...c, ...clienteData } : c));
      } else {
        const { data, error } = await supabase.from('clientes').insert([clienteData]).select();
        if (error) throw error;
        if (data && data.length > 0) {
          setClientes([data[0], ...clientes]);
        }
      }
      setView('list');
    } catch (err: any) {
      console.error('Erro ao salvar cliente:', err);
      alert(err.message || 'Ocorreu um erro ao salvar o cliente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!supabase || !deleteModalId) return;
    try {
      const { error } = await supabase.from('clientes').delete().eq('id', deleteModalId);
      if (error) throw error;
      setClientes(clientes.filter(c => c.id !== deleteModalId));
      setDeleteModalId(null);
    } catch (err) {
      console.error('Erro ao excluir cliente:', err);
      alert('Erro ao excluir o cliente.');
    }
  };

  if (view === 'form') {
    return (
      <div className="flex flex-col gap-6 w-full pb-8">
        <form onSubmit={handleSave} className="flex flex-col gap-6 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                type="button"
                onClick={() => setView('list')}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  {editingItem ? 'Editar Cliente' : 'Novo Cliente'}
                </h1>
                <p className="text-sm text-slate-500 mt-1">Preencha os dados abaixo para salvar o registro do cliente.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => setView('list')}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Salvar Cliente
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex border-b border-slate-100 px-6 gap-6 pt-4">
              <button 
                type="button"
                onClick={() => setActiveTab('principais')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'principais' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                Dados Principais
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab('endereco')}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'endereco' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                Endereço e Contatos
              </button>
            </div>
            
            <div className="p-6">
              {activeTab === 'principais' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Razão Social *</label>
                    <input required name="razao_social" type="text" defaultValue={editingItem?.razao_social} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Ex: Siderúrgica Alfa LTDA" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">CNPJ *</label>
                    <input required name="cnpj" type="text" defaultValue={editingItem?.cnpj} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="00.000.000/0001-00" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Status</label>
                    <select name="status" defaultValue={editingItem?.status || 'Prospect'} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                      <option value="Prospect">Prospect</option>
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'endereco' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700">Endereço Completo</label>
                    <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Rua, Número, Bairro" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">CEP</label>
                    <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="00000-000" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700">Cidade *</label>
                    <input name="cidade" required type="text" defaultValue={editingItem?.cidade} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Estado *</label>
                    <select name="estado" required defaultValue={editingItem?.estado || 'SP'} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                      <option value="SP">São Paulo (SP)</option>
                      <option value="PR">Paraná (PR)</option>
                      <option value="GO">Goiás (GO)</option>
                      <option value="SC">Santa Catarina (SC)</option>
                    </select>
                  </div>
                </div>
              )}
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
          <h1 className="text-2xl font-bold text-slate-800">CRM & Clientes</h1>
          <p className="text-slate-500 text-sm mt-1">Gestão de carteira e segmentação de compradores.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border text-slate-700 border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
            <Filter size={16} /> Segmentar
          </button>
          <button 
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus size={16} /> Novo Cliente
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <div className="p-4 border-b border-slate-100 flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por Razão Social ou CNPJ..." 
                className="pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full transition-all"
              />
            </div>
            <button className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1">
               Status: Todos
            </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-8 flex justify-center text-slate-400"><Loader2 className="animate-spin" /></div>
          ) : clientes.length === 0 ? (
             <div className="p-8 text-center text-slate-500">Nenhum cliente encontrado.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Razão Social</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">CNPJ</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Localização</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clientes.map((cliente, idx) => {
                  const colors = ['bg-orange-100 text-orange-700', 'bg-blue-100 text-blue-700', 'bg-green-100 text-green-700', 'bg-slate-100 text-slate-700'];
                  return (
                    <tr key={cliente.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs shrink-0 ${colors[idx % colors.length]}`}>
                            {cliente.razao_social?.substring(0, 2).toUpperCase()}
                          </div>
                          <p className="font-medium text-slate-900 truncate max-w-[200px]">{cliente.razao_social}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-mono text-xs">{cliente.cnpj}</td>
                      <td className="px-6 py-4 text-slate-600 text-sm whitespace-nowrap">{cliente.cidade} - {cliente.estado}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium uppercase tracking-wider ${
                          cliente.status === 'Ativo' ? 'bg-green-50 text-green-700 border border-green-200/50' : 
                          cliente.status === 'Prospect' ? 'bg-purple-50 text-purple-700 border border-purple-200/50' :
                          'bg-slate-100 text-slate-700 border border-slate-200/50'
                        }`}>
                          {cliente.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(cliente)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Editar">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => setDeleteModalId(cliente.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Excluir">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
        <div className="p-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
          <p>Mostrando {clientes.length} registros</p>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-5">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                    <AlertTriangle size={20} />
                 </div>
                 <div>
                   <h3 className="text-lg font-semibold text-slate-900">Excluir Cliente</h3>
                 </div>
               </div>
               <button onClick={() => setDeleteModalId(null)} className="text-slate-400 hover:text-slate-600 p-1">
                 <X size={20} />
               </button>
            </div>
            
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
            </p>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button 
                onClick={() => setDeleteModalId(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm"
              >
                Sim, excluir cliente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

