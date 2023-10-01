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
    listarCliente(filtro = '', linhas = 10, pagina = 0) {
        return axiosJwt.get(urlBase + `?page=${pagina}&size=${linhas}&sort=nome&filter=${filtro}`);
    },
    buscarClientePorId(id) {
        return axiosJwt.get(urlBase + '/' + id);
    }, 
    listarClienteCsv() {
        return axiosJwt.get(urlBase + '/csv');
    },
};
