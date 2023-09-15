import {cadastrarClienteMenu} from "./cadastroCliente/menu";

export const clienteMenu = {
    items: [
        {
            label: 'Clientes',
            icon: 'pi pi-users',
            to: '/cliente',
            items: [cadastrarClienteMenu]
        }
    ]
};
