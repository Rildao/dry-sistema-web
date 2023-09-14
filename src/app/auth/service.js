import Axios from 'axios';
import { apiUrl } from '@/service';

const urlBase = apiUrl + '/auth/login';

export const loginService = {
    login(credenciais) {
        return Axios.post(urlBase, credenciais);
    }
};
