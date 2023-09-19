import { novoClienteMenu } from '@/app/cliente/cadastroCliente/menu';
import { listaClienteMenu } from "@/app/cliente/listaCliente/menu";

export const clienteMenu = {
    items: [
        {
            label: 'Clientes',
            icon: 'pi pi-users',
            to: '/clientes',
            items: [novoClienteMenu, listaClienteMenu]
        }
    ]
};
