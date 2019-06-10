export default function tableWitnesses(props) {
  return [
    {text: `Testemunhas:`, style: 'p', margin: [0, 50, 0, 0], headlineLevel: 700},
    props.generateTable({
      header: [
        {text: '1)', border: [false, false, false, false]},
        {text: '', border: [false, false, false, true]},
        {text: 'RG', border: [false, false, false, false]},
        {text: '', border: [false, false, false, true]},
        {text: 'Assinatura', border: [false, false, false, false]},
        {text: '', border: [false, false, false, true]},
      ],
      body: [
        {text: '2)', border: [false, false, false, false]},
        {text: '', border: [false, false, false, true]},
        {text: 'RG', border: [false, false, false, false]},
        {text: '', border: [false, false, false, true]},
        {text: 'Assinatura', border: [false, false, false, false]},
        {text: '', border: [false, false, false, true]}
      ],
      widths: ['auto', '*', 'auto', 80, 'auto', 120],
      styles: props.styles
    })
  ]

    // props.generateTable({
    //   body: [
    //     {text: '2)', border: [false, false, false, false]},
    //     {text: '', border: [false, false, false, true]},
    //     {text: 'RG', border: [false, false, false, false]},
    //     {text: '', border: [false, false, false, true]},
    //     {text: 'Assinatura', border: [false, false, false, false]},
    //     {text: '', border: [false, false, false, true]}
    //   ],
    //   widths: ['auto', '*', 'auto', 80, 'auto', 120],
    //   styles: props.styles
    // })
}