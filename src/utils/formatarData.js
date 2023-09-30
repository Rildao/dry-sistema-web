import moment from 'moment';

export function formatarData(value, format) {
    if (value) {
        return moment(value).format(format);
    }
    return '';
}

export function formatarDataBrasileiraParaIso(data) {
    if (typeof data === 'string') {
        const partes = data.split('/');
        if (partes.length === 3) {
            const dia = partes[0];
            const mes = partes[1];
            const ano = partes[2];
            return `${ano}-${mes}-${dia}`;
        }
    } else if (data instanceof Date) {
        return moment(data).format('YYYY-MM-DD');
    }
}
