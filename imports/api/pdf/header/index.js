var logo = Assets.absoluteFilePath('images/logo-document-header.png');

export default function header() {
  return {
    columns: [
      {image: logo, width: 110},
      {text: [
        'LOCAMEX - Escritório\n',
        'Rua Monsenhor Antônio Pepe, 52 - Parque Jabaquara\n',
        'CEP: 04357-080 - São Paulo - SP\n',
        'Tel. (11) 5532-0790 / 5533-5614 / 5031-4762 / 3132-7175\n',
        {text: 'locamex@locamex.com.br', link: 'mailto:locamex@locamex.com.br'}
      ], style: 'p', alignment: 'right'}
  ],
  margin: [30, 30, 30, 30]
  }
}