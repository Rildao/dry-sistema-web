export function formatarEnumVenda(tipoVenda) {
    switch (tipoVenda) {
        case 'CREDIARIO':
            return 'Crediário';
        case 'CARTAO_CREDITO':
            return 'Cartão de Credito';
        case 'DINHEIRO':
            return 'Dinheiro';
        case 'PIX':
            return 'Pix';
    }
}
