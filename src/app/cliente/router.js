import { novoClienteRota } from './cadastroCliente/router';

export const clienteRota = {
    path: '/clientes',
    name: 'Cliente',
    component: () => import('./Cliente.vue'),
    children: [novoClienteRota]
};
