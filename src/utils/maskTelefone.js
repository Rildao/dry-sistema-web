export function maskTelefone(telefone) {
    if (telefone) {
        telefone = telefone.replace(/[^\d]/g, '');
        return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return '-';
}
