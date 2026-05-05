// Multi-Tenant Base
export interface BaseEntity {
  id: string;
  tenant_id: string; // Garantia de separação de dados
  created_at?: string;
}

export type PerfilAcesso = 'admin' | 'financeiro' | 'vendedor' | 'representante';

export interface Usuario extends BaseEntity {
  nome: string;
  email: string;
  perfil: PerfilAcesso;
  status: boolean;
}

export interface Representada extends BaseEntity {
  nome_fantasia: string;
  cnpj: string;
  contrato_resumo: string;
  tipo_negociacao?: 'Percentual (%)' | 'Valor Fixo (R$)';
  valor_negociacao?: number;
  ajuda_custo: number;
  status: 'Ativo' | 'Inativo';
}

export interface Cliente extends BaseEntity {
  razao_social: string;
  cnpj: string;
  segmento: string;
  status: 'Prospect' | 'Ativo' | 'Inativo';
  cidade: string;
  estado: string;
  curva_abc?: 'A' | 'B' | 'C'; // Classificação de métricas de BI
}

export interface Produto extends BaseEntity {
  representada_id: string;
  codigo_sku: string;
  nome: string;
  categoria: string;
  preco_base: number;
}

// Novos Módulos

export interface Proposta extends BaseEntity {
  cliente_id: string;
  cliente_nome?: string;
  data_emissao: string;
  status: 'Rascunho' | 'Enviada' | 'Aceita' | 'Recusada';
  valor_total: number;
  observacoes?: string;
}

export interface Pedido extends BaseEntity {
  proposta_id?: string;
  cliente_id: string;
  cliente_nome?: string;
  data_pedido: string;
  status: 'Em Processamento' | 'Faturado' | 'Entregue' | 'Cancelado';
  valor_total: number;
  comissao_gerada: number;
}

export interface LancamentoFinanceiro extends BaseEntity {
  tipo: 'Receita' | 'Despesa';
  descricao: string;
  data_vencimento: string;
  data_pagamento?: string;
  valor: number;
  status: 'Pendente' | 'Pago' | 'Atrasado';
  pedido_id?: string;
}
