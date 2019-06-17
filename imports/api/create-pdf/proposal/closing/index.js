import moment from 'moment';

export default function closing (data) {
  return {text: [
    'Nos colocamos à disposição para quaisquer esclarecimentos que se fizerem necessários.\n',
    'Locamex Locações e Obras Eireli (optante pelo Simples Nacional).\n',
    'CNPJ 05.411.043/0001-83\n',
    {text: 'locamex@locamex.com.br\n', link: 'mailto:locamex@locamex.com.br'},
    {text: 'www.locamex.com.br\n', link: 'http://www.locamex.com.br'}
  ], style: 'p'}
}