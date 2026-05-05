import React, { useState } from 'react';
import { Search, Plus, ArrowLeft, Save, Trash2, Edit2, X, AlertTriangle, FileText, CheckCircle, Clock } from 'lucide-react';

const MOCK_CONCILIACOES = [
  { id: '1', data: '2023-11-20', descricao: 'Recebimento Siderúrgica Alfa', valor: 25000.00, tipo: 'Entrada', status: 'Conciliado' },
  { id: '2', data: '2023-11-15', descricao: 'Pagamento Companhia Energia', valor: -850.00, tipo: 'Saída', status: 'Conciliado' },
  { id: '3', data: '2023-11-28', descricao: 'Desconhecido', valor: -120.00, tipo: 'Saída', status: 'Pendente' },
];

export default function ConciliacaoBancaria() {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  if (view === 'form') {
    return (
      <div className="flex flex-col gap-6 w-full pb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('list')} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{editingItem ? 'Editar Lançamento' : 'Novo Lançamento / Importar OFX'}</h1>
              <p className="text-sm text-slate-500 mt-1">Preencha os dados manualmente ou importe de um arquivo.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setView('list')} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Cancelar</button>
            <button onClick={() => setView('list')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
              <Save size={16} /> Salvar
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700">Descrição *</label>
             <input type="text" defaultValue={editingItem?.descricao} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
           </div>
           <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700">Data *</label>
             <input type="date" defaultValue={editingItem?.data} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
           </div>
           <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700">Valor (R$) *</label>
             <input type="number" defaultValue={editingItem?.valor} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
           </div>
           <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700">Fluxo</label>
             <select defaultValue={editingItem?.tipo || 'Entrada'} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Entrada">Entrada (Positivo)</option>
                <option value="Saída">Saída (Negativo)</option>
             </select>
           </div>
           <div className="space-y-2 md:col-span-2">
             <label className="text-sm font-medium text-slate-700">Status</label>
             <select defaultValue={editingItem?.status || 'Pendente'} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Pendente">Pendente de Conciliação</option>
                <option value="Conciliado">Conciliado</option>
             </select>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Conciliação Bancária</h1>
          <p className="text-slate-500 text-sm mt-1">Importe extratos (OFX) ou lance movimentos manualmente.</p>
        </div>
        <div className="flex gap-2">
            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2 border border-slate-200">
              <FileText size={16} /> Importar OFX
            </button>
            <button onClick={() => { setEditingItem(null); setView('form'); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
              <Plus size={16} /> Novo Lançamento
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Buscar lançamento..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_CONCILIACOES.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 group">
                  <td className="px-6 py-4 text-slate-600 text-sm whitespace-nowrap">{new Date(item.data).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{item.descricao}</td>
                  <td className="px-6 py-4 font-bold">
                     <span className={item.valor < 0 ? 'text-red-600' : 'text-emerald-600'}>
                        {item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                       item.status === 'Conciliado' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                     }`}>
                       {item.status === 'Conciliado' ? <CheckCircle size={12} /> : <Clock size={12} />}
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
        </div>
      </div>

      {deleteModalId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-start justify-between mb-5">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0"><AlertTriangle size={20} /></div>
                 <h3 className="text-lg font-semibold text-slate-900">Excluir Lançamento</h3>
               </div>
               <button onClick={() => setDeleteModalId(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <p className="text-sm text-slate-600 mb-6">Esta ação removerá o lançamento bancário.</p>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button onClick={() => setDeleteModalId(null)} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">Cancelar</button>
              <button onClick={() => setDeleteModalId(null)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Sim, excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
