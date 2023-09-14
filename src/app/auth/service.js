import Axios from 'axios';
import { apiUrl } from '@/env/env.homolog.json';

const urlBase = apiUrl + '/auth/login';

export const loginService = {
    login(credenciais) {
        return Axios.post(urlBase, credenciais);
    }
};
