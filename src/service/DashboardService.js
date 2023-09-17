import { apiUrl, axiosJwt } from '@/service';

const urlBase = apiUrl + '/api/painel-administrativo';

export const DashboardService = {
    buscarPainelAdministrativo() {
        return axiosJwt.get(urlBase);
    }
};
