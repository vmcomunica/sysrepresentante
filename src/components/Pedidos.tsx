import React, { useState } from 'react';
import { Search, Plus, ArrowLeft, Save, Trash2, Edit2, X, AlertTriangle, ShoppingCart, Truck, CheckSquare, XSquare, Printer, Mail } from 'lucide-react';
import { Pedido } from '../types';

const MOCK_PEDIDOS: Pedido[] = [
  { id: '1', tenant_id: 't1', cliente_id: '1', cliente_nome: 'Siderúrgica Alfa LTDA', data_pedido: '2023-11-05', status: 'Entregue', valor_total: 154000.50, comissao_gerada: 15400.05 },
  { id: '2', tenant_id: 't1', cliente_id: '2', cliente_nome: 'Escola do Futuro', data_pedido: '2023-11-12', status: 'Faturado', valor_total: 12000.00, comissao_gerada: 1200.00 },
  { id: '3', tenant_id: 't1', cliente_id: '5', cliente_nome: 'Supermercados Sul', data_pedido: '2023-11-16', status: 'Em Processamento', valor_total: 8500.00, comissao_gerada: 425.00 },
];

export default function Pedidos() {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingItem, setEditingItem] = useState<Pedido | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  const [printQueued, setPrintQueued] = useState(false);

  React.useEffect(() => {
    if (printQueued && view === 'form') {
      const timer = setTimeout(() => {
        window.print();
        setPrintQueued(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [printQueued, view]);

  const handlePrint = () => {
    window.print();
  };

  const handlePrintItem = (item: Pedido) => {
    setEditingItem(item);
    setView('form');
    setPrintQueued(true);
  };

  const handleEmail = (id: string) => {
    alert(`E-mail com o pedido enviado com sucesso para o cliente!`);
  };

  if (view === 'form') {
    return (
      <div className="flex flex-col gap-6 w-full pb-8 relative print:block print:p-0">
        <div className="flex items-center justify-between no-print">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('list')} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{editingItem ? 'Editar Pedido' : 'Novo Pedido'}</h1>
              <p className="text-sm text-slate-500 mt-1">Gere um pedido de venda e acompanhe seu status.</p>
            </div>
          </div>
          <div className="flex gap-3">
            {editingItem && (
               <button onClick={handlePrint} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                 <Printer size={16} /> Imprimir
               </button>
            )}
            <button onClick={() => setView('list')} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Cancelar</button>
            <button onClick={() => setView('list')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
              <Save size={16} /> Salvar Pedido
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
           <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700">Cliente *</label>
             <select defaultValue={editingItem?.cliente_id || ""} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
               <option value="">Selecione o Cliente</option>
               <option value="1">Siderúrgica Alfa LTDA</option>
               <option value="2">Escola do Futuro</option>
               <option value="5">Supermercados Sul</option>
             </select>
           </div>
           <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700">Data do Pedido *</label>
             <input type="date" defaultValue={editingItem?.data_pedido} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
           </div>
           <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700">Valor Total (R$) *</label>
             <input type="number" defaultValue={editingItem?.valor_total} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
           </div>
           <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700">Comissão Gerada Estimada (R$)</label>
             <input type="number" defaultValue={editingItem?.comissao_gerada} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
           </div>
           <div className="space-y-2 md:col-span-2">
             <label className="text-sm font-medium text-slate-700">Status</label>
             <select defaultValue={editingItem?.status || 'Em Processamento'} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
               <option value="Em Processamento">Em Processamento</option>
               <option value="Faturado">Faturado</option>
               <option value="Entregue">Entregue</option>
               <option value="Cancelado">Cancelado</option>
             </select>
           </div>
        </div>

        {/* Layout de Impressão (Apenas no Print) */}
        {editingItem && (
          <div className="hidden print:block p-12 bg-white text-black font-sans w-full max-w-4xl mx-auto mt-8 mb-8">
            {/* Cabecalho do Pedido */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-8 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Comercial SaaS</h1>
                <p className="text-sm text-slate-600">Av. Paulista, 1000 - Bela Vista</p>
                <p className="text-sm text-slate-600">São Paulo, SP - 01311-100</p>
                <p className="text-sm text-slate-600">CNPJ: 00.000.000/0001-00</p>
              </div>
              <div className="text-right">
                <h2 className="text-4xl font-bold text-blue-600 mb-2">PEDIDO DE VENDA</h2>
                <p className="text-slate-600 font-medium">Nº PD-{editingItem.id.padStart(4, '0')}</p>
                <p className="text-slate-600">Emissão: {new Date(editingItem.data_pedido).toLocaleDateString('pt-BR')}</p>
                <p className="inline-block mt-2 px-3 py-1 bg-slate-100 text-slate-700 font-bold text-sm rounded border border-slate-200 uppercase">
                  STATUS: {editingItem.status}
                </p>
              </div>
            </div>

            {/* Dados do Cliente */}
            <div className="bg-slate-50 p-6 rounded-lg mb-8 border border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Faturar Para:</h3>
              <p className="text-xl font-bold text-slate-900 mb-1">{editingItem.cliente_nome}</p>
              <p className="text-slate-600">A/C: Financeiro / Recebimento</p>
            </div>

            {/* Descricao Servicos/Produtos */}
            <div className="mb-8">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-800 text-sm font-bold text-slate-800 uppercase">
                    <th className="py-3 px-4">Item Solicitado</th>
                    <th className="py-3 px-4 text-center">Qtd</th>
                    <th className="py-3 px-4 text-right">Valor Unitário</th>
                    <th className="py-3 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="py-4 px-4">
                       <p className="font-semibold text-slate-900">Licenças Corporativas - Lote</p>
                       <p className="text-sm text-slate-500 mt-1">Conforme proposta aprovada.</p>
                    </td>
                    <td className="py-4 px-4 text-center text-slate-800">1</td>
                    <td className="py-4 px-4 text-right text-slate-800">{editingItem.valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                    <td className="py-4 px-4 text-right font-medium text-slate-900">{editingItem.valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total e Condicoes */}
            <div className="flex justify-end pt-8 border-t border-slate-200">
               <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 w-1/3">
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-slate-600 font-medium">Subtotal</span>
                   <span className="text-slate-900">{editingItem.valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                 </div>
                 <div className="flex justify-between items-center pt-2 border-t border-slate-200 mt-2">
                   <span className="text-lg font-bold text-slate-900">Total do Pedido</span>
                   <span className="text-xl font-bold text-blue-600">{editingItem.valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                 </div>
               </div>
            </div>
            
            {/* Assinatura */}
            <div className="mt-20 pt-8 flex justify-between items-center px-12">
              <div className="text-center w-64">
                <div className="border-b border-black mb-2"></div>
                <p className="text-sm font-bold text-slate-900">Responsável Financeiro</p>
                <p className="text-xs text-slate-500">Comercial SaaS Inc.</p>
              </div>
              <div className="text-center w-64">
                <div className="border-b border-black mb-2"></div>
                <p className="text-sm font-bold text-slate-900">Aceite do Cliente</p>
                <p className="text-xs text-slate-500">Data: ___/___/20__</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pedidos de Venda</h1>
          <p className="text-slate-500 text-sm mt-1">Converteu propostas? Acompanhe o ciclo de faturamento aqui.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
            <Printer size={16} /> Imprimir Lista
          </button>
          <button onClick={() => { setEditingItem(null); setView('form'); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
            <Plus size={16} /> Novo Pedido
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Buscar pedido..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nº & Cliente</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Faturado</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Comissão</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_PEDIDOS.map((item) => {
                const isProcess = item.status === 'Em Processamento';
                const isBilled = item.status === 'Faturado';
                const isDelivered = item.status === 'Entregue';
                const isCanceled = item.status === 'Cancelado';

                return (
                  <tr key={item.id} className="hover:bg-slate-50 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded bg-slate-100 flex items-center justify-center shrink-0 ${
                          isDelivered ? 'bg-emerald-100 text-emerald-600' :
                          isCanceled ? 'bg-red-100 text-red-600' :
                          isBilled ? 'bg-indigo-100 text-indigo-600' :
                          'bg-amber-100 text-amber-600'
                        }`}>
                          {isDelivered ? <CheckSquare size={16} /> : isCanceled ? <XSquare size={16} /> : isBilled ? <Truck size={16} /> : <ShoppingCart size={16} />}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">PD-{item.id.padStart(4, '0')}</p>
                          <p className="text-xs text-slate-500 font-medium">{item.cliente_nome}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm font-medium">{new Date(item.data_pedido).toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-4 text-slate-800 text-sm font-bold">
                       {item.valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="px-6 py-4 text-green-700 text-sm font-semibold">
                       {item.comissao_gerada.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        isDelivered ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                        isCanceled ? 'bg-red-50 text-red-700 border border-red-200' :
                        isBilled ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEmail(item.id)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Enviar por E-mail"><Mail size={16} /></button>
                          <button onClick={() => handlePrintItem(item)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded" title="Imprimir"><Printer size={16} /></button>
                          <button onClick={() => { setEditingItem(item); setView('form'); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Editar"><Edit2 size={16} /></button>
                          <button onClick={() => setDeleteModalId(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded" title="Excluir"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
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
                 <h3 className="text-lg font-semibold text-slate-900">Excluir Pedido</h3>
               </div>
               <button onClick={() => setDeleteModalId(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <p className="text-sm text-slate-600 mb-6">Esta ação removerá o pedido permanentemente.</p>
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
