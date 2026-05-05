# Especificações Técnicas e Arquitetura: SaaS para Gestão de Representantes Comerciais

## 1. Visão Geral do Sistema e Evolução Multi-Tenant
O sistema é um **SaaS (Software as a Service)** voltado para a otimização da gestão de Representantes Comerciais. 
**Evolução:** A plataforma agora suporta uma estrutura multiempresa (Multi-Tenant), permitindo que diferentes escritórios de representação ou empresas gerenciem seus usuários, clientes, produtos, propostas, pedidos e operações financeiras de forma isolada, tudo acompanhado de um módulo de Business Intelligence (BI).

---

## 2. Instalação e Execução
O frontend atual é uma Single Page Application construída com React, Vite e Tailwind CSS.

---

## 3. Padrão Arquitetural: MVC Aprimorado & SaaS Multi-Tenant

### 3.1. Estrutura Backend Recomendada (Mentalidade Multi-Tenant)
- **Isolamento de Dados:** Todas as tabelas pertinentes a uma operação devem conter a chave `tenant_id`.
- **Autenticação:** JWT ou OAuth2 com escopo de tenant e perfis de acesso (Role-Based Access Control - RBAC).
- **Perfis (Roles):** Admin, Financeiro, Vendedor, Representante.

### 3.2. Módulos do Sistema
1. **Representadas & Produtos:** Gestão do catálogo, comissionamento e fornecedores.
2. **CRM & Clientes:** Gestão da carteira com curva ABC.
3. **Propostas & Pedidos:** Geração de orçamentos múltiplos produtos, conversão em pedidos e faturamento.
4. **Financeiro:** Contas a Pagar (comissões a repassar, despesas) e Receber (comissões auferidas), Fluxo de Caixa.
5. **BI (Dashboard):** Métricas consolidadas, conversão de funil, saúde financeira e performance (Curva ABC).

---

## 4. Modelagem de Dados (SaaS Scale)
Adicionando `tenant_id` (*Foreign Key* para `tenants`) em todas as entidades transacionais.

### 4.1. Tabelas de Fundação (SaaS)
```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY,
  razao_social VARCHAR(255),
  documento VARCHAR(20) -- CNPJ
);

CREATE TABLE usuarios (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  nome VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  perfil ENUM('admin', 'financeiro', 'vendedor', 'representante'),
  status BOOLEAN DEFAULT TRUE
);
```

### 4.2. Tabelas de Negócio (Evolução)
- **`representadas`**, **`clientes`**, **`produtos`**: Recebem `tenant_id`.
- **`propostas`**: `id`, `tenant_id`, `cliente_id`, `status` ('rascunho', 'enviada', 'aceita', 'recusada').
- **`pedidos`**: `id`, `tenant_id`, `proposta_id`, `cliente_id`, `status_pedido`, `valor_total`.
- **`financeiro_lancamentos`**: `id`, `tenant_id`, `tipo` ('receita', 'despesa'), `valor`, `data_vencimento`, `status`, `pedido_id` (opcional).

---

## 5. UI/UX: Design Moderno ("Clean Admin" & Dashboards)
- **Sidebar & Navegação:** Separação clara entre módulos Operacionais (CRM, Produtos, Pedidos) e Estratégicos (Financeiro, BI).
- **Tabelas Inteligentes:** Filtros dinâmicos e paginação.
- **Data Visualization:** Uso de gráficos e cards de KPIs para conversão rápida de inteligência.
