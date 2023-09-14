import axios from 'axios';
import { apiUrl } from '@/service';

export const validarToken = (token) => {
    if (token != null) {
        return axios.get(apiUrl + `/auth/validarToken/${token}`).then((response) => {
            return response.data.sucesso;
        });
    }
};
