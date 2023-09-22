import { listaVendaMenu } from '@/app/venda/listaVenda/menu';

export const vendaMenu = {
    items: [
        {
            label: 'Vendas',
            icon: 'pi pi-shopping-cart',
            to: '/vendas',
            items: [ listaVendaMenu]
        }
    ]
};
