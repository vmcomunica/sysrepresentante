import React from 'react';
import { Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export default function FluxoCaixa() {
  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Fluxo de Caixa</h1>
          <p className="text-slate-500 text-sm mt-1">Visão consolidada de entradas e saídas do mês.</p>
        </div>
        <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
          <Download size={16} /> Exportar Relatório
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-emerald-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <TrendingUp size={64} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-700">Entradas (Receitas)</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-2">R$ 55.400,00</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <TrendingDown size={64} className="text-red-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-red-700">Saídas (Despesas)</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-2">R$ 14.850,00</h3>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <DollarSign size={64} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Saldo Operacional</p>
            <h3 className="text-2xl font-bold text-white mt-2">R$ 40.550,00</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-semibold text-slate-800">Transações Recentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">Classificação</th>
                <th className="px-6 py-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-600">10/11/2023</td>
                <td className="px-6 py-4 font-medium text-slate-800">Siderúrgica Alfa LTDA</td>
                <td className="px-6 py-4"><span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-100">Recebimento</span></td>
                <td className="px-6 py-4 text-right font-bold text-emerald-600">+ R$ 25.000,00</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-600">15/11/2023</td>
                <td className="px-6 py-4 font-medium text-slate-800">Companhia de Energia</td>
                <td className="px-6 py-4"><span className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded border border-red-100">Pagamento</span></td>
                <td className="px-6 py-4 text-right font-bold text-red-600">- R$ 850,00</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-600">20/11/2023</td>
                <td className="px-6 py-4 font-medium text-slate-800">Escola do Futuro</td>
                <td className="px-6 py-4"><span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-100">Recebimento</span></td>
                <td className="px-6 py-4 text-right font-bold text-emerald-600">+ R$ 6.000,00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
