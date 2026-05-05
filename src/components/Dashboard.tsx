import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  FileText, 
  Calculator,
  AlertCircle,
  Clock,
  CheckCircle2,
  Users
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from 'recharts';

export default function Dashboard() {
  const kpis = [
    { label: 'Faturamento', value: 'R$ 845.200', change: '+12.5%', isPositive: true, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Recebimentos', value: 'R$ 412.500', change: '+8.2%', isPositive: true, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pedidos', value: '1,248', change: '-2.4%', isPositive: false, icon: ShoppingCart, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Propostas', value: '3,412', change: '+15.3%', isPositive: true, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Ticket Médio', value: 'R$ 677,24', change: '+4.1%', isPositive: true, icon: Calculator, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  const lineChartData = [
    { name: 'Jan', faturamento: 400000, recebimentos: 240000 },
    { name: 'Fev', faturamento: 300000, recebimentos: 139800 },
    { name: 'Mar', faturamento: 200000, recebimentos: 980000 },
    { name: 'Abr', faturamento: 278000, recebimentos: 390800 },
    { name: 'Mai', faturamento: 189000, recebimentos: 480000 },
    { name: 'Jun', faturamento: 239000, recebimentos: 380000 },
    { name: 'Jul', faturamento: 349000, recebimentos: 430000 },
  ];

  const pieData = [
    { name: 'Faturado', value: 400, color: '#10B981' },
    { name: 'Aberto', value: 300, color: '#3B82F6' },
    { name: 'Em Produção', value: 300, color: '#F59E0B' },
    { name: 'Cancelado', value: 100, color: '#EF4444' },
  ];

  const topReps = [
    { name: 'Carlos Silva', val: 'R$ 145.200', pct: 85, img: 'https://i.pravatar.cc/150?u=1' },
    { name: 'Ana Oliveira', val: 'R$ 128.400', pct: 75, img: 'https://i.pravatar.cc/150?u=2' },
    { name: 'Marcos Almeida', val: 'R$ 98.150', pct: 60, img: 'https://i.pravatar.cc/150?u=3' },
    { name: 'Juliana Costa', val: 'R$ 87.900', pct: 50, img: 'https://i.pravatar.cc/150?u=4' },
  ];

  const activities = [
    { type: 'pedido', text: 'Pedido PED-0042 faturado', time: 'Há 5 min', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
    { type: 'proposta', text: 'Proposta enviada para Siderúrgica Alfa', time: 'Há 12 min', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
    { type: 'cliente', text: 'Novo cliente cadastrado: TechCorp SA', time: 'Há 1 hora', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { type: 'financeiro', text: 'Conta recebida: R$ 4.500,00', time: 'Há 2 horas', icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Bem-vindo de volta, Admin</h1>
        <p className="text-slate-500 mt-1 text-sm">Aqui está o resumo da sua operação hoje.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                 <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${kpi.bg}`}>
                   <Icon size={20} className={kpi.color} />
                 </div>
                 <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                   kpi.isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
                 }`}>
                   {kpi.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                   {kpi.change}
                 </div>
              </div>
              <h3 className="text-slate-500 text-sm font-medium mb-1">{kpi.label}</h3>
              <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
              <p className="text-[11px] text-slate-400 mt-2 font-medium">vs mês anterior</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Gráfico Faturamento x Recebimentos (2 cols) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm xl:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-semibold text-slate-800">Vendas — últimos 12 meses</h2>
            <select className="text-sm bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 cursor-pointer">
              <option>Últimos 6 meses</option>
              <option>Este ano</option>
            </select>
          </div>
          <div className="flex-1 w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} tickFormatter={(value) => `R$ ${value/1000}k`} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, undefined]}
                />
                <Legend iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '20px'}} />
                <Line type="monotone" dataKey="faturamento" name="Faturamento" stroke="#4f46e5" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="recebimentos" name="Comissão" stroke="#818cf8" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funil de Pedidos (Gráfico de Pizza Substituído) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-semibold text-slate-800">Funil de Pedidos</h2>
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-4">
             {[
               { stage: 'Rascunho', count: 48, percentage: 100, color: 'bg-slate-200' },
               { stage: 'Enviado', count: 36, percentage: 75, color: 'bg-indigo-300' },
               { stage: 'Aprovado', count: 24, percentage: 50, color: 'bg-indigo-500' },
               { stage: 'Faturado', count: 18, percentage: 37.5, color: 'bg-indigo-700' }
             ].map((item, idx) => (
               <div key={idx} className="w-full relative">
                 <div className="flex justify-between text-sm mb-1 px-1 relative z-10">
                   <span className="font-semibold text-slate-700 drop-shadow-sm">{item.stage}</span>
                   <span className="font-bold text-slate-900 drop-shadow-sm">{item.count}</span>
                 </div>
                 <div className="h-8 w-full bg-slate-50 rounded-lg flex justify-center items-center overflow-hidden">
                   <div 
                     className={`h-full ${item.color} transition-all duration-300 rounded`} 
                     style={{ width: `${item.percentage}%` }}
                   ></div>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Third Row: Curva ABC + Top Reps + Activities + Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Curva ABC */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm col-span-1">
          <h2 className="text-base font-semibold text-slate-800 mb-6">Curva ABC</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                 <span className="font-semibold text-slate-800 flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div> Classe A</span>
                 <span className="text-slate-500 font-medium">65%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 font-medium">28 clientes correspondem a 70% da receita</p>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                 <span className="font-semibold text-slate-800 flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-indigo-400"></div> Classe B</span>
                 <span className="text-slate-500 font-medium">25%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-400 rounded-full" style={{ width: '25%' }}></div>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 font-medium">42 clientes correspondem a 20% da receita</p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                 <span className="font-semibold text-slate-800 flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-indigo-200"></div> Classe C</span>
                 <span className="text-slate-500 font-medium">10%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-200 rounded-full" style={{ width: '10%' }}></div>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 font-medium">78 clientes correspondem a 10% da receita</p>
            </div>
          </div>
        </div>

        {/* Top Representadas */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm col-span-1 border-t-4 border-t-indigo-500">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-base font-semibold text-slate-800">Top Representadas</h2>
             <span className="text-xs text-indigo-600 font-medium hover:underline cursor-pointer">Ver todos</span>
          </div>
          <div className="space-y-5">
            {[
              { name: 'Acme Industrial', val: 'R$ 124.000', pct: 85, img: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&h=150&fit=crop' },
              { name: 'Globex Distrib.', val: 'R$ 98.000', pct: 70, img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&h=150&fit=crop' },
              { name: 'Initech Compon.', val: 'R$ 76.000', pct: 55, img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=150&h=150&fit=crop' },
              { name: 'Umbrella Pharma', val: 'R$ 58.000', pct: 40, img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=150&h=150&fit=crop' },
              { name: 'Soylent Foods', val: 'R$ 42.000', pct: 25, img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?w=150&h=150&fit=crop' }
            ].map((rep, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <img src={rep.img} alt={rep.name} className="w-10 h-10 rounded border border-slate-200 bg-slate-100 object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1.5">
                    <p className="text-sm font-semibold text-slate-900 truncate">{rep.name}</p>
                    <span className="text-xs font-bold text-slate-700">{rep.val}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${rep.pct}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Atividades Recentes */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm col-span-1">
          <h2 className="text-base font-semibold text-slate-800 mb-6">Atividades Recentes</h2>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent pt-2">
             <div className="relative z-10 space-y-6">
              {activities.map((act, idx) => {
                const Icon = act.icon;
                return (
                  <div key={idx} className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-[3px] border-white ${act.bg} ${act.color} shadow-sm`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 mt-1">
                      <p className="text-sm text-slate-700 font-semibold">{act.text}</p>
                      <span className="text-xs text-slate-400 font-medium">{act.time}</span>
                    </div>
                  </div>
                )
              })}
             </div>
          </div>
        </div>

        {/* Alertas */}
        <div className="col-span-1 space-y-4">
           <div className="bg-red-50/80 border border-red-100 p-5 rounded-xl flex items-start gap-3 hover:bg-red-50 transition-colors cursor-pointer group">
              <AlertCircle size={22} className="text-red-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-red-900 mb-1 pl-0">Contas Vencidas</h4>
                <p className="text-[13px] text-red-700 leading-relaxed font-medium">Existem 3 contas a pagar vencidas referentes ao mês anterior.</p>
                <button className="mt-3 text-xs font-bold text-red-700 group-hover:text-red-800 flex items-center gap-1 uppercase tracking-wider">Ver Contas &rarr;</button>
              </div>
           </div>

           <div className="bg-orange-50/80 border border-orange-100 p-5 rounded-xl flex items-start gap-3 hover:bg-orange-50 transition-colors cursor-pointer group">
              <Clock size={22} className="text-orange-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-orange-900 mb-1">Propostas Pendentes</h4>
                <p className="text-[13px] text-orange-700 leading-relaxed font-medium">12 propostas aguardam retorno há mais de 5 dias úteis.</p>
                <button className="mt-3 text-xs font-bold text-orange-700 group-hover:text-orange-800 flex items-center gap-1 uppercase tracking-wider">Acompanhar Funil &rarr;</button>
              </div>
           </div>

           <div className="bg-blue-50/80 border border-blue-100 p-5 rounded-xl flex items-start gap-3 hover:bg-blue-50 transition-colors cursor-pointer">
              <CheckCircle2 size={22} className="text-blue-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">Metas Atingidas</h4>
                <p className="text-[13px] text-blue-700 leading-relaxed font-medium">A equipe comercial alcançou a meta com 12 dias de antecedência.</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
