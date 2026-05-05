import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Download, TrendingUp, DollarSign, Calendar } from 'lucide-react';

const comissoesData = [
  { name: 'Acme Indústria', tipo_negociacao: 'Percentual (%)', valor_negociacao: 15, vendas: 154000.50 },
  { name: 'TechCorp SA', tipo_negociacao: 'Percentual (%)', valor_negociacao: 25, vendas: 12000.00 },
  { name: 'Global Traders', tipo_negociacao: 'Valor Fixo (R$)', valor_negociacao: 50, vendas: 8500.00 },
];

export default function Relatorios() {
  const [periodo, setPeriodo] = useState('mes_atual');

  const processedData = comissoesData.map(item => {
    let comissao_receber = 0;
    if (item.tipo_negociacao === 'Percentual (%)') {
      comissao_receber = item.vendas * (item.valor_negociacao / 100);
    } else {
      // Valor Fixo (R$) por negócio (simulando 1 negócio por R$ 8500, então 1x50 = 50)
      // Como não temos quantidade de negócios na tabela mock, vamos colocar o valor fixo gerado para a tela
      comissao_receber = item.valor_negociacao * Math.floor(item.vendas / 1000); 
    }
    return { ...item, comissao_receber };
  });

  const totalReceber = processedData.reduce((acc, item) => acc + item.comissao_receber, 0);
  const totalVendas = processedData.reduce((acc, item) => acc + item.vendas, 0);

  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Relatórios</h1>
          <p className="text-slate-500 text-sm mt-1">Visão consolidada de comissões a receber por representante.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-48">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select 
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none font-medium h-10"
            >
              <option value="mes_atual">Mês Atual</option>
              <option value="mes_passado">Mês Passado</option>
              <option value="ultimos_30">Últimos 30 Dias</option>
              <option value="ano_atual">Ano Atual</option>
            </select>
          </div>
          <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 h-10 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
            <Download size={16} /> Exportar PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total de Comissões a Receber</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-2">
                {totalReceber.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600 font-medium">
            <TrendingUp size={16} />
            <span>Baseado nas aprovações deste mês</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Volume Total de Vendas</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-2">
                {totalVendas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <FileText size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <span>Faturado no período</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800">Comissões a Receber por Representada</h3>
          <p className="text-sm text-slate-500">Detalhamento dos valores devidos pelas fábricas parceiras.</p>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `R$ ${val}`} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(val: number) => [val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 'Valor']}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar name="Comissão a Receber" dataKey="comissao_receber" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-semibold text-slate-800">Detalhamento Analítico</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Representada</th>
                <th className="px-6 py-4">Taxa / Valor Base</th>
                <th className="px-6 py-4">Faturamento Gerado</th>
                <th className="px-6 py-4 text-right">Comissão a Receber</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedData.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-800">{item.name}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {item.tipo_negociacao === 'Valor Fixo (R$)' 
                      ? `${item.valor_negociacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'})} fixo`
                      : `${item.valor_negociacao}%`}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{item.vendas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-600">
                    {item.comissao_receber.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50/80 border-t border-slate-200 font-bold">
              <tr>
                <td className="px-6 py-4 text-slate-800">Total</td>
                <td className="px-6 py-4 text-slate-800">-</td>
                <td className="px-6 py-4 text-slate-800">{totalVendas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td className="px-6 py-4 text-right text-emerald-600">{totalReceber.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
