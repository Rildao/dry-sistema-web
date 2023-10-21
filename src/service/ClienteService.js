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
    listarCliente(filtro = '', page = '', size = '') {
        return axiosJwt.get(urlBase + `?page=${page}&size=${size}&sort=nome&filter=${filtro}`);
    },
    buscarClientePorId(id) {
        return axiosJwt.get(urlBase + '/' + id);
    },
    listarClienteCsv() {
        return axiosJwt.get(urlBase + '/csv');
    }
};
