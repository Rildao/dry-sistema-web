import { axiosJwt } from '@/service';
import { apiUrl } from '@/service';

const urlBase = apiUrl + '/api/lancamento-crediario';

export const LancamentoService = {
    listarLancamento(id) {
        return axiosJwt.get(urlBase + '/' + id);
    },
    atualizarLancamento(lancamento) {
        return axiosJwt.put(urlBase + '/' + lancamento.id, lancamento);
    }
};
