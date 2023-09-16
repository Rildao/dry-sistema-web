import { novoClienteMenu } from '@/app/cliente/cadastroCliente/menu';

export const clienteMenu = {
    items: [
        {
            label: 'Clientes',
            icon: 'pi pi-users',
            to: '/clientes',
            items: [novoClienteMenu]
        }
    ]
};
