import { axiosJwt } from '@/service';
import { apiUrl } from '@/service';

const urlBase = apiUrl + '/api/cliente';

export const ClienteService = {
    criarCliente(cliente) {
        return axiosJwt.post(urlBase, cliente);
    },
    criarClienteComVendas(cliente) {
        return axiosJwt.post(urlBase + '/venda', cliente);
    },
    listarCliente() {
        return axiosJwt.get(urlBase);
    },
    buscarClientePorId(id) {
        return axiosJwt.get(urlBase + '/' + id);
    }
};
