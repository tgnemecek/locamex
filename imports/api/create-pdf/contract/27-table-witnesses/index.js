export default function tableWitnesses(props) {
  return [
    {text: `Testemunhas:`, style: 'p', margin: [0, 50, 0, 0]},
    {table: {
      widths: ['auto', '*', 'auto', 80, 'auto', 120],
      heights: props.styles.cellheight,
      body: [
          [ {text: '1)', border: [false, false, false, false]},
          {text: '', border: [false, false, false, true]},
          {text: 'RG', border: [false, false, false, false]},
          {text: '', border: [false, false, false, true]},
          {text: 'Assinatura', border: [false, false, false, false]},
          {text: '', border: [false, false, false, true]} ],
          [ {text: '2)', border: [false, false, false, false]},
          {text: '', border: [false, false, false, true]},
          {text: 'RG', border: [false, false, false, false]},
          {text: '', border: [false, false, false, true]},
          {text: 'Assinatura', border: [false, false, false, false]},
          {text: '', border: [false, false, false, true]} ]
        ]
    }, style: 'table'}
  ]
}