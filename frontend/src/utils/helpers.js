import numeral from 'numeral';
import moment from 'moment';

numeral.register('locale', 'vi', {
  delimiters: {
    thousands: '.',
    decimal: ',',
  },
  abbreviations: {
    thousand: 'Nghìn',
    million: 'Triệu',
    billion: 'Tỷ',
    trillion: 'Nghìn Tỷ',
  },
  currency: {
    symbol: '₫',
  },
});
numeral.locale('vi');
function formatDateDisplay(date) {
  if (!date) return;
  return moment(date).format('DD/MM/YYYY');
}
export { numeral as numeralCustom, formatDateDisplay };
