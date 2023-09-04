import axios from 'axios';

export const validarToken = (token) => {
    if (token != null) {
        return axios.get(import.meta.env.VITE_API_URL + `/auth/validarToken/${token}`).then((response) => {
            return response.data.sucesso;
        });
    }
};
