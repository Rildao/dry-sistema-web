import {cadastrarClienteRota} from "./cadastroCliente/router";

export const clienteRota = {
    path: '/cliente',
    name: 'Cliente',
    component: () => import('./Cliente.vue'),
    children: [cadastrarClienteRota]
};
