import { axiosJwt } from '@/service';
import { apiUrl } from '@/service';

const urlBase = apiUrl + '/api/venda';

export const VendaService = {
    criarVenda(venda) {
        return axiosJwt.post(urlBase, venda);
    },
    listarVenda(tamanho = 10, pagina = 0, clienteId = '') {
        return axiosJwt.get(urlBase + `?clientId=${clienteId}&size=${tamanho}&page=${pagina}`);
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
