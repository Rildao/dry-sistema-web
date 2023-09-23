import { novoClienteRota, editarClienteRota } from './formCliente/router';
import { listaClienteRota } from './listaCliente/router';

export const clienteRota = {
    path: '/clientes',
    name: 'Cliente',
    component: () => import('./Cliente.vue'),
    children: [novoClienteRota, editarClienteRota, listaClienteRota]
};
