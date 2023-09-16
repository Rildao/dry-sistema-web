import { axiosJwt } from "@/service";
import { apiUrl } from '@/service';

const urlBase = apiUrl + '/api/cliente';

export const ClienteService = {
  criarCliente(cliente) {
    return axiosJwt.post(urlBase, cliente);
  }
};
