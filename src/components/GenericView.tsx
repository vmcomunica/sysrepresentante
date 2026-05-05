import React from 'react';
import { Search, Plus } from 'lucide-react';

export default function GenericView({ title, description, btnText }: { title: string, description: string, btnText: string }) {
  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
          <p className="text-slate-500 text-sm mt-1">{description}</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
          <Plus size={16} /> {btnText}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center py-20">
         <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
            <Search className="text-slate-400" size={24} />
         </div>
         <h3 className="text-base font-semibold text-slate-800">Nenhum registro encontrado</h3>
         <p className="text-sm text-slate-500 mt-1 mb-6 text-center max-w-sm">Este módulo está integrado ao padrão UI/UX SaaS. Adicione o primeiro registro para visualizar a listagem e os gráficos vinculados.</p>
         <button className="text-blue-600 font-medium text-sm flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">
            Adicionar Primeiro Registro
         </button>
      </div>
    </div>
  );
}
