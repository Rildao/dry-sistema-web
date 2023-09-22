import { axiosJwt } from '@/service';
import { apiUrl } from '@/service';

const urlBase = apiUrl + '/api/venda';

export const VendaService = {
    criarVenda(venda) {
        return axiosJwt.post(urlBase, venda);
    },
    listarVenda() {
        return axiosJwt.get(urlBase);
    },
    buscarVendaPorId(id) {
        return axiosJwt.get(urlBase + '/' + id);
    }
};
