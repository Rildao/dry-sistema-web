import { axiosJwt } from '@/service';
import { apiUrl } from '@/service';

const urlBase = apiUrl + '/api/relatorio';

export const RelatorioService = {
    emitirRelatorio(dataInicio, dataFim) {
        return axiosJwt.get(urlBase + `?dataInicio=${dataInicio}&dataFim=${dataFim}`);
    }
};
