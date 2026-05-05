import React, { useState } from 'react';
import { Search, Plus, ArrowUpRight, CheckCircle, Clock, ArrowLeft, Save, Trash2, Edit2, X, AlertTriangle } from 'lucide-react';

const MOCK_RECEBER = [
  { id: '1', cliente: 'Siderúrgica Alfa LTDA', vencimento: '2023-11-20', valor: 25000.00, status: 'Pago' },
  { id: '2', cliente: 'Escola do Futuro', vencimento: '2023-11-25', valor: 6000.00, status: 'Pendente' },
  { id: '3', cliente: 'Supermercados Sul', vencimento: '2023-11-30', valor: 4250.00, status: 'Pendente' },
];

export default function ContasReceber() {
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
              <h1 className="text-xl font-bold text-slate-800">{editingItem ? 'Editar Conta a Receber' : 'Novo Recebimento'}</h1>
              <p className="text-sm text-slate-500 mt-1">Preencha os dados do título a receber.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setView('list')} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Cancelar</button>
            <button onClick={() => setView('list')} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm">
              <Save size={16} /> Salvar Conta
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700">Cliente *</label>
             <input type="text" defaultValue={editingItem?.cliente} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
           </div>
           <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700">Vencimento *</label>
             <input type="date" defaultValue={editingItem?.vencimento} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
           </div>
           <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700">Valor (R$) *</label>
             <input type="number" defaultValue={editingItem?.valor} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
           </div>
           <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700">Status</label>
             <select defaultValue={editingItem?.status || 'Pendente'} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Pendente">Pendente</option>
                <option value="Pago">Pago</option>
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
          <h1 className="text-2xl font-bold text-slate-800">Contas a Receber</h1>
          <p className="text-slate-500 text-sm mt-1">Gestão de faturas e pagamentos a receber dos clientes.</p>
        </div>
        <button onClick={() => { setEditingItem(null); setView('form'); }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
          <Plus size={16} /> Novo Recebimento
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Buscar título..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vencimento</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_RECEBER.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                        <ArrowUpRight size={16} />
                      </div>
                      <p className="font-medium text-slate-900">{item.cliente}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{new Date(item.vencimento).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                     {item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                       item.status === 'Pago' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                     }`}>
                       {item.status === 'Pago' ? <CheckCircle size={14} /> : <Clock size={14} />}
                       {item.status}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingItem(item); setView('form'); }} className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded" title="Editar"><Edit2 size={16} /></button>
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
                 <h3 className="text-lg font-semibold text-slate-900">Excluir Conta a Receber</h3>
               </div>
               <button onClick={() => setDeleteModalId(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <p className="text-sm text-slate-600 mb-6">Esta ação removerá o título permanentemente.</p>
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
