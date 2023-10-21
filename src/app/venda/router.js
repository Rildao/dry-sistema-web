export const vendaRota = {
    path: '/vendas',
    name: 'Vendas',
    component: () => import('./listaVenda/ListaVenda.vue')
    // children: [listaVendaRota]
};
