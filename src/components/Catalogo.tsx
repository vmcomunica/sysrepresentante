import React, { useState } from 'react';
import { Search, Plus, Tag, ArrowLeft, Save, Trash2, Edit2, X, AlertTriangle } from 'lucide-react';
import { Produto } from '../types';

const MOCK_PRODUTOS: Produto[] = [
  { id: '1', tenant_id: 't1', representada_id: '1', codigo_sku: 'ACM-001', nome: 'Torno CNC X-2000', categoria: 'Equipamentos', preco_base: 150000 },
  { id: '2', tenant_id: 't1', representada_id: '1', codigo_sku: 'ACM-002', nome: 'Fresa Industrial Gamma', categoria: 'Equipamentos', preco_base: 85000 },
  { id: '3', tenant_id: 't1', representada_id: '2', codigo_sku: 'SOF-EDU', nome: 'Licença LMS Escolar (Anual)', categoria: 'Software', preco_base: 12000 },
  { id: '4', tenant_id: 't1', representada_id: '3', codigo_sku: 'FERT-01', nome: 'Adubo NPK Premium 1 Ton', categoria: 'Insumos', preco_base: 4500 },
];

export default function Catalogo() {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingItem, setEditingItem] = useState<Produto | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  const filtered = MOCK_PRODUTOS.filter(p => 
    p.nome.toLowerCase().includes(filter.toLowerCase()) || 
    p.codigo_sku.toLowerCase().includes(filter.toLowerCase())
  );

  const handleCreate = () => {
    setEditingItem(null);
    setView('form');
  };

  const handleEdit = (produto: Produto) => {
    setEditingItem(produto);
    setView('form');
  };

  if (view === 'form') {
    return (
      <div className="flex flex-col gap-6 w-full pb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView('list')}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                {editingItem ? 'Editar Produto' : 'Novo Produto'}
              </h1>
              <p className="text-sm text-slate-500 mt-1">Preencha os dados abaixo para salvar o produto no catálogo.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setView('list')}
              className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={() => setView('list')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Save size={16} /> Salvar Produto
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex border-b border-slate-100 px-6 gap-6 pt-4">
            <button className="pb-3 text-sm font-medium border-b-2 border-blue-600 text-blue-600 transition-colors">
              Informações do Produto
            </button>
          </div>
          
          <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2 lg:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Nome do Produto *</label>
                  <input type="text" defaultValue={editingItem?.nome} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Ex: Torno Mecânico" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Código SKU *</label>
                  <input type="text" defaultValue={editingItem?.codigo_sku} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="SKU-1234" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Representante/Fornecedor *</label>
                  <select defaultValue={editingItem?.representada_id} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                    <option value="">Selecione...</option>
                    <option value="1">Acme Indústria</option>
                    <option value="2">TechCorp SA</option>
                    <option value="3">Global Traders</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Categoria</label>
                  <select defaultValue={editingItem?.categoria} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                    <option value="Equipamentos">Equipamentos</option>
                    <option value="Software">Software</option>
                    <option value="Insumos">Insumos</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Preço Base (R$) *</label>
                  <input type="number" defaultValue={editingItem?.preco_base} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="0.00" />
                </div>
                <div className="space-y-2 lg:col-span-3">
                  <label className="text-sm font-medium text-slate-700">Descrição Detalhada</label>
                  <textarea rows={4} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Detalhes técnicos sobre o produto..."></textarea>
                </div>
              </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Catálogo de Produtos</h1>
          <p className="text-slate-500 text-sm mt-1">Gerencie itens, preços e metadados das representadas.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <Plus size={16} /> Novo Produto
        </button>
      </div>

      <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou SKU..." 
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-slate-100 transition-all"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select className="bg-white border border-slate-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto text-slate-700 hover:bg-slate-50 transition-colors">
             <option value="">Todas Representadas</option>
             <option value="1">Acme Indústria</option>
             <option value="2">TechCorp SA</option>
             <option value="3">Global Traders</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((prod) => (
          <div key={prod.id} className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors group">
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200/60 shadow-sm">
                  {prod.codigo_sku}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-200/50 uppercase tracking-wider">
                  {prod.categoria}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 line-clamp-2 mt-2 leading-snug">
                {prod.nome}
              </h3>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                Selo/Representante ID: Rep-{prod.representada_id}
              </p>
            </div>
            
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-end justify-between">
              <div>
                <span className="block text-xs text-slate-500 font-medium mb-1">Preço Base</span>
                <span className="text-lg font-bold text-slate-900 tracking-tight">
                  {prod.preco_base.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(prod)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100" title="Editar">
                   <Edit2 size={16} />
                </button>
                <button onClick={() => setDeleteModalId(prod.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" title="Excluir">
                   <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white border border-slate-200 border-dashed rounded-xl">
            Nenhum produto encontrado.
          </div>
        )}
      </div>

      {deleteModalId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-5">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                    <AlertTriangle size={20} />
                 </div>
                 <div>
                   <h3 className="text-lg font-semibold text-slate-900">Excluir Produto</h3>
                 </div>
               </div>
               <button onClick={() => setDeleteModalId(null)} className="text-slate-400 hover:text-slate-600 p-1">
                 <X size={20} />
               </button>
            </div>
            
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Tem certeza que deseja remover este produto do catálogo? Esta ação não afetará os pedidos ou propostas que já utilizaram este item.
            </p>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button 
                onClick={() => setDeleteModalId(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => setDeleteModalId(null)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm"
              >
                Sim, excluir produto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
