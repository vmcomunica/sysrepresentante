import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  LayoutDashboard, 
  PackageSearch,
  Menu,
  Bell,
  Search,
  LogOut,
  ChevronRight,
  Wallet,
  FileText,
  ShoppingCart,
  Settings,
  PieChart,
  BarChart,
  ArrowRightLeft,
  Briefcase,
  ShieldCheck,
  ChevronDown,
  Building
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  setCurrentView: (view: string) => void;
}

export default function Layout({ children, currentView, setCurrentView }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const operacionaisItems = [
    { id: 'dashboard', label: 'Dashboard Principal', icon: LayoutDashboard },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'catalogo', label: 'Produtos', icon: PackageSearch },
    { id: 'propostas', label: 'Propostas', icon: FileText },
    { id: 'pedidos', label: 'Pedidos', icon: ShoppingCart },
    { id: 'representadas', label: 'Representantes', icon: Briefcase },
  ];

  const financeiroItems = [
    { id: 'contas-receber', label: 'Contas a Receber', icon: Wallet },
    { id: 'contas-pagar', label: 'Contas a Pagar', icon: FileText },
    { id: 'fluxo-caixa', label: 'Fluxo de Caixa', icon: ArrowRightLeft },
    { id: 'conciliacao', label: 'Conciliação Bancária', icon: ShieldCheck },
  ];

  const biItems = [
    { id: 'bi-dashboard', label: 'Dashboard BI', icon: PieChart },
    { id: 'curva-abc', label: 'Curva ABC', icon: BarChart },
    { id: 'relatorios', label: 'Relatórios', icon: FileText },
  ];

  const adminItems = [
    { id: 'empresas', label: 'Empresas', icon: Building2 },
    { id: 'usuarios', label: 'Usuários', icon: Users },
    { id: 'permissoes', label: 'Permissões', icon: ShieldCheck },
    { id: 'planos', label: 'Planos', icon: Settings },
  ];

  const renderNavGroup = (title: string, items: typeof operacionaisItems) => (
    <>
      {sidebarOpen && <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-4 mb-2 mt-6">{title}</div>}
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id || (item.id === 'dashboard' && !currentView);
        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex items-center gap-3 px-4 py-2.5 w-full text-left rounded-lg transition-colors ${
              isActive 
                ? 'bg-blue-600/10 text-blue-400 font-medium' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white font-medium'
            }`}
            title={!sidebarOpen ? item.label : undefined}
          >
            <Icon size={18} className={isActive ? 'text-blue-400' : 'text-slate-400'} />
            {sidebarOpen && <span className="text-sm">{item.label}</span>}
          </button>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800 print:block print:bg-white print:min-h-0 print:h-auto">
      {/* Sidebar - Dark Theme */}
      <aside 
        className={`no-print ${
          sidebarOpen ? 'w-64' : 'w-20'
        } transition-all duration-300 ease-in-out bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 z-20`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
          {sidebarOpen && (
            <div className="flex items-center gap-2 px-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold opacity-90 text-sm">CS</div>
              <span className="text-base font-bold tracking-tight text-white">Comercial SaaS</span>
            </div>
          )}
          {!sidebarOpen && (
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold cursor-pointer text-sm" onClick={() => setSidebarOpen(true)}>CS</div>
          )}
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-4 custom-scrollbar">
          {renderNavGroup('Operacional', operacionaisItems)}
          {renderNavGroup('Financeiro', financeiroItems)}
          {renderNavGroup('BI & Relatórios', biItems)}
          {renderNavGroup('Administração', adminItems)}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Menu size={18} />
            {sidebarOpen && <span className="text-sm font-medium">Recolher Menu</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 print:block print:h-auto print:overflow-visible print:bg-white">
        {/* Top Navigation Bar - Light */}
        <header className="no-print h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 relative z-10 w-full shadow-sm">
          {/* Left / Search */}
          <div className="flex items-center gap-4 flex-1">
             <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 -ml-2 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <Menu size={20} />
              </button>
             <div className="relative hidden sm:block max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Pesquisar em todo o sistema (Ctrl+K)..." 
                  className="pl-10 pr-4 py-2 bg-slate-100/70 border border-transparent hover:bg-slate-100 focus:bg-white rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full transition-all"
                />
              </div>
          </div>
          
          {/* Right / Actions */}
          <div className="flex items-center gap-4">
            {/* Tenant Selector */}
            <div className="hidden md:flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
              <Building size={16} className="text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Matriz Siderúrgica</span>
              <ChevronDown size={14} className="text-slate-400 ml-1" />
            </div>

            <div className="h-6 w-px bg-slate-200 mx-1"></div>

            <button className="relative p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            {/* User Profile */}
            <div className="flex items-center gap-3 cursor-pointer p-1 rounded-full hover:bg-slate-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
                 <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-full h-full object-cover" />
              </div>
               <div className="hidden sm:flex flex-col min-w-0 pr-1">
                 <span className="text-sm font-medium text-slate-900 leading-tight">Admin SaaS</span>
                 <span className="text-xs text-slate-500">Diretor</span>
               </div>
               <ChevronDown size={14} className="text-slate-400 hidden sm:block mr-1" />
            </div>
          </div>
        </header>

        {/* Dynamic View Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 flex flex-col gap-6 print:block print:overflow-visible print:p-0 print:m-0">
          <div className="max-w-[1400px] mx-auto w-full print:max-w-none print:w-full print:mx-0 print:block">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
