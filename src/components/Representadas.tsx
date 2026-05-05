import React, { useState } from 'react';
import { Search, Plus, ArrowLeft, Save, Trash2, Edit2, X, AlertTriangle, Building2 } from 'lucide-react';
import { Representada } from '../types';

const MOCK_REPRESENTADAS: Representada[] = [
  { id: '1', tenant_id: 't1', nome_fantasia: 'Acme Indústria', cnpj: '12.345.678/0001-90', contrato_resumo: 'Máquinas e Equipamentos Base', tipo_negociacao: 'Percentual (%)', valor_negociacao: 15, ajuda_custo: 1500, status: 'Ativo' },
  { id: '2', tenant_id: 't1', nome_fantasia: 'TechCorp SA', cnpj: '98.765.432/0001-10', contrato_resumo: 'Software Educacional', tipo_negociacao: 'Percentual (%)', valor_negociacao: 25, ajuda_custo: 0, status: 'Ativo' },
  { id: '3', tenant_id: 't1', nome_fantasia: 'Global Traders', cnpj: '45.123.890/0001-55', contrato_resumo: 'Importação Insumos Agrícolas', tipo_negociacao: 'Valor Fixo (R$)', valor_negociacao: 50, ajuda_custo: 500, status: 'Inativo' },
];

export default function Representadas() {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingItem, setEditingItem] = useState<Representada | null>(null);
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
              <h1 className="text-xl font-bold text-slate-800">{editingItem ? 'Editar Representante' : 'Novo Representante'}</h1>
              <p className="text-sm text-slate-500 mt-1">Preencha os dados do representante / fábrica.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setView('list')} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Cancelar</button>
            <button onClick={() => setView('list')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
              <Save size={16} /> Salvar Vínculo
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700">Nome Fantasia *</label>
             <input type="text" defaultValue={editingItem?.nome_fantasia} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
           </div>
           <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700">CNPJ *</label>
             <input type="text" defaultValue={editingItem?.cnpj} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
           </div>
           <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700">Tipo de Negociação</label>
             <select defaultValue={editingItem?.tipo_negociacao} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Percentual (%)">Percentual (%)</option>
                <option value="Valor Fixo (R$)">Valor Fixo (R$)</option>
             </select>
           </div>
           <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700">Valor/Percentual Negociado</label>
             <input type="number" defaultValue={editingItem?.valor_negociacao} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
           </div>
           <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700">Ajuda de Custo (R$)</label>
             <input type="number" defaultValue={editingItem?.ajuda_custo} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Representantes & Fábricas</h1>
          <p className="text-slate-500 text-sm mt-1">Gestão de fábricas e representadas.</p>
        </div>
        <button onClick={() => { setEditingItem(null); setView('form'); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
          <Plus size={16} /> Novo Vínculo
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Buscar..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Representada</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">CNPJ</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Negociação</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_REPRESENTADAS.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500 shrink-0"><Building2 size={16} /></div>
                      <div>
                        <p className="font-medium text-slate-900">{item.nome_fantasia}</p>
                        <p className="text-xs text-slate-500">{item.contrato_resumo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-mono text-xs">{item.cnpj}</td>
                  <td className="px-6 py-4">
                     <span className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">{item.tipo_negociacao}</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-sm text-slate-700">
                     {item.tipo_negociacao === 'Valor Fixo (R$)' ? `R$ ${item.valor_negociacao}` : `${item.valor_negociacao}%`}
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
                 <h3 className="text-lg font-semibold text-slate-900">Excluir Representante</h3>
               </div>
               <button onClick={() => setDeleteModalId(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <p className="text-sm text-slate-600 mb-6">Esta ação removerá a representada.</p>
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
