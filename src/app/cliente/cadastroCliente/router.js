export const novoClienteRota = {
    path: '/clientes/novo-cliente',
    name: 'Cliente',
    component: () => import('./CadastroCliente.vue')
};
