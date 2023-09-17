import moment from 'moment';

export function formatarData(value, format) {
    if (value) {
        return moment(value).format(format);
    }
    return '';
}
