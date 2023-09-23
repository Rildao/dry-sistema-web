import { axiosJwt } from '@/service';
import { apiUrl } from '@/service';

const urlBase = apiUrl + '/api/notificacao';

export const NotificacaoService = {
    listarNotificacao(filtro = '', linhas = 10, pagina = 0, lido = false) {
        return axiosJwt.get(urlBase + `?page=${pagina}&size=${linhas}&filter=${filtro}&lido=${lido}`);
    }
};
