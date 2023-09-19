import { novoClienteRota } from './cadastroCliente/router';
import { listaClienteRota } from './listaCliente/router';

export const clienteRota = {
    path: '/clientes',
    name: 'Cliente',
    component: () => import('./Cliente.vue'),
    children: [novoClienteRota, listaClienteRota]
};
