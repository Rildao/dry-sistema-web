export function formatarEnumStatus(status) {
    switch (status) {
        case 'ATRASADO':
            return 'Atrasado';
        case 'PAGO':
            return 'Pago';
        case 'ANDAMENTO':
            return 'Andamento';
    }
}
