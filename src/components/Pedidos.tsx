import React, { useState, useEffect } from 'react';
import { Search, Plus, ArrowLeft, Save, Trash2, Edit2, X, AlertTriangle, ShoppingCart, Truck, CheckSquare, XSquare, Printer, Mail, Loader2 } from 'lucide-react';
import { Pedido } from '../types';
import { supabase } from '../lib/supabase';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingItem, setEditingItem] = useState<Pedido | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [printQueued, setPrintQueued] = useState(false);

  useEffect(() => {
    fetchPedidos();
  }, []);

  async function fetchPedidos() {
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase.from('pedidos').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setPedidos(data);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
    } finally {
      setLoading(false);
    }
  }

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

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    
    const formData = new FormData(e.currentTarget);
    const pedidoData = {
      cliente_nome: formData.get('cliente_nome') as string,
      data_pedido: formData.get('data_pedido') as string,
      valor_total: Number(formData.get('valor_total')),
      status: formData.get('status') as string,
    };

    try {
      if (editingItem) {
        const { error } = await supabase.from('pedidos').update(pedidoData).eq('id', editingItem.id);
        if (error) throw error;
        setPedidos(pedidos.map(p => p.id === editingItem.id ? { ...p, ...pedidoData } : p));
      } else {
        const { data, error } = await supabase.from('pedidos').insert([pedidoData]).select();
        if (error) throw error;
        if (data && data.length > 0) {
          setPedidos([data[0], ...pedidos]);
        }
      }
      setView('list');
    } catch (err) {
      console.error('Erro ao salvar pedido:', err);
      alert('Ocorreu um erro ao salvar o pedido.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!supabase || !deleteModalId) return;
    try {
      const { error } = await supabase.from('pedidos').delete().eq('id', deleteModalId);
      if (error) throw error;
      setPedidos(pedidos.filter(p => p.id !== deleteModalId));
      setDeleteModalId(null);
    } catch (err) {
      console.error('Erro ao excluir pedido:', err);
      alert('Erro ao excluir o pedido.');
    }
  };

  if (view === 'form') {
    return (
      <div className="flex flex-col gap-6 w-full pb-8 relative print:block print:p-0">
        <form onSubmit={handleSave} className="flex flex-col gap-6 w-full">
          <div className="flex items-center justify-between no-print">
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setView('list')} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors">
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-800">{editingItem ? 'Editar Pedido' : 'Novo Pedido'}</h1>
                <p className="text-sm text-slate-500 mt-1">Gere um pedido de venda e acompanhe seu status.</p>
              </div>
            </div>
            <div className="flex gap-3">
              {editingItem && (
                 <button type="button" onClick={handlePrint} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                   <Printer size={16} /> Imprimir
                 </button>
              )}
              <button type="button" onClick={() => setView('list')} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Cancelar</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Salvar Pedido
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
             <div className="space-y-2">
               <label className="text-sm font-medium text-slate-700">Nome do Cliente *</label>
               <input required name="cliente_nome" type="text" defaultValue={editingItem?.cliente_nome} placeholder="Ex: Siderúrgica Alfa" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium text-slate-700">Data do Pedido *</label>
               <input required name="data_pedido" type="date" defaultValue={editingItem?.data_pedido || new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium text-slate-700">Valor Total (R$) *</label>
               <input required name="valor_total" type="number" step="0.01" defaultValue={editingItem?.valor_total} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium text-slate-700">Comissão Gerada Estimada (R$)</label>
               <input type="number" disabled value={editingItem ? Number(editingItem.valor_total) * 0.1 : 0} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed" />
               <p className="text-xs text-slate-400">10% calculado automaticamente.</p>
             </div>
             <div className="space-y-2 md:col-span-2">
               <label className="text-sm font-medium text-slate-700">Status</label>
               <select name="status" defaultValue={editingItem?.status || 'Em Processamento'} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                 <option value="Em Processamento">Em Processamento</option>
                 <option value="Faturado">Faturado</option>
                 <option value="Entregue">Entregue</option>
                 <option value="Cancelado">Cancelado</option>
               </select>
             </div>
          </div>
        </form>

        {/* Layout de Impressão (Apenas no Print) */}
        {editingItem && (
          <div className="hidden print:block bg-white text-black font-sans w-full max-w-4xl mx-auto p-4 md:p-8">
            {/* Cabecalho do Pedido */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-slate-800 mb-6">Pedido de Venda &middot; Representação Comercial</p>
                <h1 className="text-5xl sm:text-7xl font-black text-slate-900 leading-none tracking-tight">PEDIDO</h1>
                <h1 className="text-5xl sm:text-7xl font-black text-slate-900 leading-none tracking-tight">DE VENDA</h1>
              </div>
              <div className="text-right mt-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-orange-500 mb-4">№ {new Date(editingItem.data_pedido).getFullYear()}.{editingItem.id?.substring(0,4)}</h2>
                <p className="text-xs sm:text-sm font-bold tracking-widest text-slate-600 uppercase mb-1">Emissão {new Date(editingItem.data_pedido).toLocaleDateString('pt-BR')}</p>
                <p className="text-xs sm:text-sm font-bold tracking-widest text-slate-600 uppercase mb-1">Validade 15 dias</p>
                <p className="text-xs sm:text-sm font-bold tracking-widest text-slate-600 uppercase">Status: {editingItem.status}</p>
              </div>
            </div>

            {/* Representada / Representante Box */}
            <div className="grid grid-cols-2 border-t-2 border-b-2 border-slate-900 mb-8">
              <div className="p-4 border-r-2 border-slate-900">
                <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Representada &middot; Fornecedor</p>
                <h3 className="text-sm font-bold text-slate-900 mb-1 uppercase">[NOME DA INDÚSTRIA REPRESENTADA]</h3>
                <p className="text-xs text-slate-600 mb-4">CNPJ 00.000.000/0001-00 &middot; contato@representada.com.br</p>
                <div className="w-full py-4 border border-dashed border-slate-300 text-center text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Logo Representada
                </div>
              </div>
              <div className="p-4">
                <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Representante</p>
                <h3 className="text-sm font-bold text-slate-900 mb-1 uppercase">[NOME DO REPRESENTANTE / ESCRITÓRIO]</h3>
                <p className="text-xs text-slate-600 mb-4">Cód. 0042 &middot; representante@escritorio.com.br &middot; (11) 90000-0000</p>
                <div className="w-full py-4 border border-dashed border-slate-300 text-center text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Logo Representante
                </div>
              </div>
            </div>

            {/* Condições do Pedido */}
            <div className="mb-8">
              <div className="flex justify-between items-baseline mb-2 border-b-2 border-slate-900 pb-1">
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Condições do Pedido</h2>
                <span className="text-xs font-mono text-slate-500 tracking-widest">01 / 04</span>
              </div>
              <div className="grid grid-cols-4 border-2 border-slate-900">
                <div className="p-3 border-r-2 border-slate-900">
                   <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1">Prazo de Entrega</p>
                   <p className="text-sm text-slate-900">30 dias úteis</p>
                </div>
                <div className="p-3 border-r-2 border-slate-900">
                   <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1">Condição de Pagamento</p>
                   <p className="text-sm text-slate-900">28 / 42 / 56 dias</p>
                </div>
                <div className="p-3 border-r-2 border-slate-900">
                   <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1">Tipo de Frete</p>
                   <p className="text-sm text-slate-900">CIF</p>
                </div>
                <div className="p-3">
                   <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1">Tabela de Preço</p>
                   <p className="text-sm text-slate-900">Tabela A &middot; 2026</p>
                </div>
              </div>
            </div>

            {/* Cliente */}
            <div className="mb-8">
              <div className="flex justify-between items-baseline mb-2 border-b-2 border-slate-900 pb-1">
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Cliente</h2>
                <span className="text-xs font-mono text-slate-500 tracking-widest">02 / 04</span>
              </div>
              <div className="border-2 border-slate-900 flex flex-col">
                <div className="grid grid-cols-[60%_40%] border-b-2 border-slate-900">
                  <div className="p-3 border-r-2 border-slate-900">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1">Razão Social</p>
                    <p className="text-sm font-medium text-slate-900">{editingItem.cliente_nome}</p>
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1">Nome Fantasia</p>
                    <p className="text-sm text-slate-900">{editingItem.cliente_nome}</p>
                  </div>
                </div>
                <div className="grid grid-cols-[35%_40%_25%] border-b-2 border-slate-900">
                  <div className="p-3 border-r-2 border-slate-900">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1">CNPJ / CPF</p>
                    <p className="text-sm text-slate-900">00.000.000/0000-00</p>
                  </div>
                  <div className="p-3 border-r-2 border-slate-900">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1">Inscrição Estadual</p>
                    <p className="text-sm text-slate-900">Isento</p>
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1">Telefone</p>
                    <p className="text-sm text-slate-900">(00) 0000-0000</p>
                  </div>
                </div>
                <div className="border-b-2 border-slate-900 p-3">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1">Endereço (Faturamento)</p>
                  <p className="text-sm text-slate-900">Endereço do cliente não informado no cadastro base</p>
                </div>
                <div className="border-b-2 border-slate-900 p-3">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1">Endereço de Entrega</p>
                  <p className="text-sm text-slate-900">Mesmo endereço de faturamento</p>
                </div>
                <div className="p-3">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1">Observações do Cliente</p>
                  <p className="text-sm text-slate-900">Entregar em horário comercial. Solicitar conferência prévia.</p>
                </div>
              </div>
            </div>

            {/* Itens do Pedido */}
            <div className="mb-8">
              <div className="flex justify-between items-baseline mb-2 border-b-2 border-slate-900 pb-1">
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Itens do Pedido</h2>
                <span className="text-xs font-mono text-slate-500 tracking-widest">03 / 04</span>
              </div>
              
              <table className="w-full text-left font-mono text-sm">
                <thead>
                  <tr className="text-orange-500 text-[10px] tracking-widest">
                    <th className="py-2 px-1 font-bold">#</th>
                    <th className="py-2 px-1 font-bold">CÓDIGO</th>
                    <th className="py-2 px-1 font-bold">SKU</th>
                    <th className="py-2 px-1 font-bold">DESCRIÇÃO</th>
                    <th className="py-2 px-1 font-bold">COR</th>
                    <th className="py-2 px-1 font-bold">UN.</th>
                    <th className="py-2 px-1 font-bold text-right">QTD</th>
                    <th className="py-2 px-1 font-bold text-right">PREÇO UN.</th>
                    <th className="py-2 px-1 font-bold text-right">DESC.%</th>
                    <th className="py-2 px-1 font-bold text-right">IPI%</th>
                    <th className="py-2 px-1 font-bold text-right">SUBTOTAL</th>
                  </tr>
                </thead>
                <tbody className="border-t border-b border-slate-300">
                  <tr className="border-b border-slate-200 border-dashed">
                    <td className="py-3 px-1 text-slate-900">01</td>
                    <td className="py-3 px-1 font-medium">PD-001</td>
                    <td className="py-3 px-1">-</td>
                    <td className="py-3 px-1 font-sans font-medium text-slate-900">Serviços / Produtos Conforme Proposta</td>
                    <td className="py-3 px-1">-</td>
                    <td className="py-3 px-1">un</td>
                    <td className="py-3 px-1 text-right">1</td>
                    <td className="py-3 px-1 text-right">{Number(editingItem.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-1 text-right">0</td>
                    <td className="py-3 px-1 text-right">0</td>
                    <td className="py-3 px-1 text-right text-orange-500 font-bold">{Number(editingItem.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Resumo Financeiro */}
            <div className="mb-12">
              <div className="flex justify-between items-baseline mb-4 border-b-2 border-slate-900 pb-1">
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Resumo Financeiro</h2>
                <span className="text-xs font-mono text-slate-500 tracking-widest">04 / 04</span>
              </div>
              
              <div className="grid grid-cols-[60%_40%] border-b-2 border-slate-900 pb-8">
                <div>
                   <p className="text-[10px] font-bold tracking-widest text-slate-900 uppercase border-b border-slate-300 pb-1 mb-2 w-3/4">Forma de Pagamento &middot; Parcelas</p>
                   <div className="flex justify-between font-mono text-xs w-3/4 py-1">
                     <span>01x &nbsp;&nbsp; À vista</span>
                     <span>R$ {Number(editingItem.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                   </div>
                </div>
                <div>
                   <div className="flex justify-between font-mono text-xs py-1 border-b border-slate-200 border-dashed">
                     <span className="uppercase tracking-widest">Subtotal Produtos</span>
                     <span>{Number(editingItem.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                   </div>
                   <div className="flex justify-between font-mono text-xs py-1 border-b border-slate-200 border-dashed">
                     <span className="uppercase tracking-widest">Descontos</span>
                     <span>- 0,00</span>
                   </div>
                   <div className="flex justify-between font-mono text-xs py-1 border-b border-slate-200 border-dashed mb-2">
                     <span className="uppercase tracking-widest">IPI</span>
                     <span>0,00</span>
                   </div>
                   <div className="flex justify-between font-mono text-xs py-1 border-b border-slate-300 mb-6">
                     <span className="uppercase tracking-widest">Qtd. Total de Peças</span>
                     <span>1</span>
                   </div>
                   <div className="flex flex-col items-end">
                     <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Total do Pedido</span>
                     <span className="text-4xl font-black text-orange-500 mt-1">R$ {Number(editingItem.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                   </div>
                </div>
              </div>

              <div className="border border-slate-300 p-4 mt-6">
                <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Observações Gerais</p>
                <p className="text-xs text-slate-700">Pedido sujeito à análise de crédito e disponibilidade de estoque. Preços expressos em Reais (R$), válidos por 15 dias.</p>
              </div>
            </div>

            {/* Assinaturas */}
            <div className="flex justify-between items-end mt-16 pt-8 pb-4">
               <div className="w-64">
                 <div className="border-t border-slate-900 pt-2 text-center">
                   <p className="text-[10px] font-bold tracking-widest uppercase text-slate-900">Representante</p>
                 </div>
               </div>
               <div className="w-64">
                 <div className="border-t border-slate-900 pt-2 text-center">
                   <p className="text-[10px] font-bold tracking-widest uppercase text-slate-900">Cliente</p>
                 </div>
               </div>
            </div>

            {/* Rodapé da Página */}
            <div className="flex justify-between items-center mt-12 text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase">
              <span>Pedido № {new Date(editingItem.data_pedido).getFullYear()}.{editingItem.id?.substring(0,4)}</span>
              <span>Página 1 de 1</span>
              <span>Documento gerado em {new Date().toLocaleDateString('pt-BR')}</span>
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
          {loading ? (
             <div className="p-8 flex justify-center text-slate-400"><Loader2 className="animate-spin" /></div>
          ) : pedidos.length === 0 ? (
             <div className="p-8 text-center text-slate-500">Nenhum pedido encontrado.</div>
          ) : (
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
                {pedidos.map((item) => {
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
                            <p className="font-semibold text-slate-900">PD-{item.id?.substring(0,4)}</p>
                            <p className="text-xs text-slate-500 font-medium">{item.cliente_nome}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm font-medium">{new Date(item.data_pedido).toLocaleDateString('pt-BR')}</td>
                      <td className="px-6 py-4 text-slate-800 text-sm font-bold">
                        {Number(item.valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="px-6 py-4 text-green-700 text-sm font-semibold">
                        {((Number(item.valor_total) || 0) * 0.1).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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
                            <button type="button" onClick={() => handleEmail(item.id)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Enviar por E-mail"><Mail size={16} /></button>
                            <button type="button" onClick={() => handlePrintItem(item)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded" title="Imprimir"><Printer size={16} /></button>
                            <button type="button" onClick={() => { setEditingItem(item); setView('form'); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Editar"><Edit2 size={16} /></button>
                            <button type="button" onClick={() => setDeleteModalId(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded" title="Excluir"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
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
                 <h3 className="text-lg font-semibold text-slate-900">Excluir Pedido</h3>
               </div>
               <button onClick={() => setDeleteModalId(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <p className="text-sm text-slate-600 mb-6">Esta ação removerá o pedido permanentemente.</p>
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
