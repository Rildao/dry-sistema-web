import { axiosJwt } from '@/service';
import { apiUrl } from '@/service';

const urlBase = apiUrl + '/api/venda';

export const VendaService = {
    criarVenda(venda) {
        return axiosJwt.post(urlBase, venda);
    },
    listarVenda(clienteId = '', page = '', tamanho = '') {
        return axiosJwt.get(urlBase + `?page=${page}&size=${tamanho}&clientId=${clienteId}`);
    },
    buscarVendaPorId(id) {
        return axiosJwt.get(urlBase + '/' + id);
    },
    atualizarVenda(venda) {
        return axiosJwt.put(urlBase + '/' + venda.id, venda);
    },
    listarVendaCsv() {
        return axiosJwt.get(urlBase + `/csv`);
    }
};
