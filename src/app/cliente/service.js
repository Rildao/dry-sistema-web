import Axios from 'axios';
import { apiUrl } from '@/service';

const urlBase = apiUrl + '/api/cliente';

export const ClienteService = {
  criarCliente(cliente) {
    console.info(cliente);
    return Axios.post(urlBase, cliente);
  }
};
