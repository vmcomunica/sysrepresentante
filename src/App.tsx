import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Representadas from './components/Representadas';
import Clientes from './components/Clientes';
import Catalogo from './components/Catalogo';
import GenericView from './components/GenericView';
import Propostas from './components/Propostas';
import Pedidos from './components/Pedidos';
import ContasReceber from './components/ContasReceber';
import ContasPagar from './components/ContasPagar';
import FluxoCaixa from './components/FluxoCaixa';
import ConciliacaoBancaria from './components/ConciliacaoBancaria';
import Usuarios from './components/Usuarios';
import Relatorios from './components/Relatorios';

import Empresas from './components/Empresas';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'representadas':
        return <Representadas />;
      case 'clientes':
        return <Clientes />;
      case 'catalogo':
        return <Catalogo />;
      case 'propostas':
        return <Propostas />;
      case 'pedidos':
        return <Pedidos />;
      case 'contas-receber':
        return <ContasReceber />;
      case 'contas-pagar':
        return <ContasPagar />;
      case 'fluxo-caixa':
        return <FluxoCaixa />;
      case 'conciliacao':
        return <ConciliacaoBancaria />;
      case 'empresas':
        return <Empresas />;
      case 'usuarios':
        return <Usuarios />;
      case 'permissoes':
        return <GenericView title="Perfis de Acesso" description="Controle granular de permissões (RBAC)." btnText="Novo Perfil" />;
      case 'planos':
        return <GenericView title="Planos de Assinatura" description="Configure as tiers do seu SaaS." btnText="Novo Plano" />;
      case 'bi-dashboard':
        return <Dashboard />; 
      case 'curva-abc':
        return <GenericView title="Análise Curva ABC" description="Detalhamento de faturamento por clientes/produtos." btnText="Exportar Relatório" />;
      case 'relatorios':
        return <Relatorios />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      {renderView()}
    </Layout>
  );
}
