export const novoClienteRota = {
    path: '/clientes/novo-cliente',
    name: 'Cliente Novo',
    component: () => import('./CadastroCliente.vue')
};

export const editarClienteRota = {
    path: '/clientes/editar-cliente/:id',
    name: 'Cliente Editar',
    component: () => import('./CadastroCliente.vue')
};
