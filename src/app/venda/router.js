import { listaVendaRota } from './listaVenda/router';

export const vendaRota = {
    path: '/vendas',
    name: 'Venda',
    component: () => import('./Venda.vue'),
    children: [listaVendaRota]
};
