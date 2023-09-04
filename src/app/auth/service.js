import Axios from 'axios';

const urlBase = import.meta.env.VITE_API_URL + '/auth/login';

export const loginService = {
    login(credenciais) {
        return Axios.post(urlBase, credenciais);
    }
};
