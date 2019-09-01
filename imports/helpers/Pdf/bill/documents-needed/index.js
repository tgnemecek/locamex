export default function documentsNeeded (data) {
  return [
    {text: 'Documentos Necessários para Cadastro', alignment: 'center', style: 'h2'},
    {ul: [
      'Pessoa Jurídica: Contrato Social (CNPJ, Inscrição Estadual e Municipal).',
      'Nome, CPF e RG do responsável que assinará o Contrato (se procurador, enviar Procuração Autorizada).',
      'Endereço completo da obra (Rua, Número, CEP, Bairro, Cidade, Estado).',
      'Nome e celular do responsável pela obra (presente no local).',
      'Ficha cadastral com principais fornecedores e referências bancárias/comerciais.'
    ], style: 'ul'}
  ]
}