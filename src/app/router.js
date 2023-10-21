import { homeRota } from './home/router';
import { clienteRota } from './cliente/router';
import { notificacaoRota } from './notificacoes/router';
import { vendaRota } from './venda/router';
import { relatorioRota } from './relatorio/router';

export const appRotas = [homeRota, relatorioRota, clienteRota, notificacaoRota, vendaRota];
