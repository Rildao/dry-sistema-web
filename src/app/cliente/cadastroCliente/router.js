export const novoClienteRota = {
    path: '/clientes/novo-cliente',
    name: 'Cliente Novo',
    component: () => import('./cadastroCliente.vue')
};

export const editarClienteRota = {
    path: '/clientes/editar-cliente/:id',
    name: 'Cliente Editar',
    component: () => import('./cadastroCliente.vue')
};
