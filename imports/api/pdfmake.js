var pdfmake = require('pdfmake/build/pdfmake');
var vfs_fonts = require('pdfmake/build/vfs_fonts');

import customTypes from '/imports/startup/custom-types';
import moment from 'moment';

export default function createPdf(state, seller, representatives) {
  const globals = {
    fontFamily: "Arial",
    h1Size: 11,
    h2Size: 10,
    pSize: 9,
    marginBottom: 10,
    cellheight: 1
  }
  const cpfCnpjLabel = state.clientInfo.type == 'company' ? 'CNPJ': 'CPF';
  const registryLabel = state.clientInfo.registryMU ? 'Inscrição Municipal': 'Inscrição Estadual';
  const showCpfCnpj = () => {
    if (state.clientInfo.type == 'company') {
      return customTypes.format(state.clientInfo.cnpj, 'cnpj');
    } else return customTypes.format(state.clientInfo.contacts[0].contactCPF, 'cpf');
  }
  const showRegistry = () => {
    if (state.clientInfo.registryMU) {
      return state.clientInfo.registryMU;
    } else return state.clientInfo.registryES;
  }
  const showAddress = () => {
    return state.clientInfo.address.street + ' ' + state.clientInfo.address.number;
  }
  const displayValue = (type) => {
    var valueStyle = {bold: true, alignment: 'right'};
    var value;
    switch(type) {
      case 'prorogation':
        value = 'R$ 10.000,00';
        break;
      case 'rent':
        value = 'R$ 10.000,00';
        break;
      case 'services':
        value = 'R$ 10.000,00';
        break;
    }
    var prefix = {text: value};
    return Object.assign(prefix, valueStyle);
  }
  const tableInformation = () => {
    return {table: {
      headerRows: 0,
      widths: ['auto', '*', 'auto', 'auto', 40, 'auto'],
      heights: globals.cellheight,
      body: [
          [ 'Razão Social', {text: state.clientInfo.officialName, colSpan: 5}, '', '', '', '' ],
          [ cpfCnpjLabel, showCpfCnpj(), {text: registryLabel, colSpan: 2}, '', {text: showRegistry(), colSpan: 2}, '' ],
          [ 'Endereço', {text: showAddress(), colSpan: 3}, '', '', 'CEP', customTypes.format(state.clientInfo.address.zip, 'zip') ],
          [ 'Cidade', state.clientInfo.address.city, 'UF', state.clientInfo.address.state, 'Bairro', state.clientInfo.address.district ],
          [ 'Contato', seller.contact, 'Telefone', customTypes.format(seller.phone, 'phone'), 'Email', seller.email ]
        ]
    }, style: 'table'};
  }
  const tableRepresentative = () => {
    const renderBody = () => {
      return representatives.map((rep) => {
        return [ 'Nome', rep.name, 'CPF', customTypes.format(rep.cpf, 'cpf'), 'RG', customTypes.format(rep.rg, 'rg') ]
      });
    }
    return {table: {
      widths: ['auto', '*', 30, 80, 30, 80],
      heights: globals.cellheight,
      body: renderBody(),
    }, style: 'table'}
  }
  const tableProducts = () => {
    const renderBody = () => {
      var allValuesOneMonth = [];
      var allValues = [];
      const calcValue = (quantity, duration, price) => {
        var result = quantity * price;
        allValuesOneMonth.push(result);
        result = result * duration;
        allValues.push(result);
        return {text: customTypes.format(result, 'currency'), alignment: 'right'};
      }
      const calcTotal = (values) => {
        var result = values.reduce((acc, current) => acc + current);
        return {text: customTypes.format(result, 'currency'), bold: true, alignment: 'right'};
      }
      var header = [ ['Item', 'Descrição', {text: 'Valor Unit. Mensal', alignment: 'left'}, {text: 'Qtd.', alignment: 'center'}, {text: 'Meses', alignment: 'center'}, {text: 'Valor Total', alignment: 'right'}] ];
      var body = state.contractInfo.products.map((product) => {
        return [ product._id, product.name, customTypes.format(product.price, 'currency'), {text: product.quantity, alignment: 'center'}, {text: state.contractInfo.duration, alignment: 'center'}, calcValue(product.quantity, state.contractInfo.duration, product.price)]
      });
      var footer = [
        [ {text: 'Valor Mensal de Prorrogação:', colSpan: 5, alignment: 'right', bold: true}, '', '', '', '', calcTotal(allValuesOneMonth)],
        [ {text: 'Valor Total da Locação:', colSpan: 5, alignment: 'right', bold: true}, '', '', '', '', calcTotal(allValues)]
      ];
      return header.concat(body, footer);
    }
    return {table: {
      headerRows: 1,
      widths: [30, '*', 90, 'auto', 40, 80],
      heights: globals.cellheight,
      body: renderBody(),
    }, style: 'table'}
  }
  const tableServices = () => {
    const renderBody = () => {
      var allValues = [];
      const calcValue = (quantity, price) => {
        var result = quantity * price;
        allValues.push(result);
        return {text: customTypes.format(result, 'currency'), alignment: 'right'};
      }
      const calcTotal = () => {
        var result = allValues.reduce((acc, current) => acc + current);
        return {text: customTypes.format(result, 'currency'), bold: true, alignment: 'right'};
      }
      var header = [ ['Item', 'Descrição', {text: 'Valor Unitário', alignment: 'left'}, {text: 'Qtd.', alignment: 'center'}, {text: 'Valor Total', alignment: 'right'}] ];
      var body = state.contractInfo.services.map((service) => {
        return [ service._id, service.name, customTypes.format(service.price, 'currency'), {text: service.quantity, alignment: 'center'}, calcValue(service.quantity, service.price)];
      });
      var footer = [
        [ {text: 'Valor Total do Pacote de Serviços:', colSpan: 4, alignment: 'right', bold: true}, '', '', '', calcTotal()]
      ];
      return header.concat(body, footer);
    }
    return {table: {
      headerRows: 1,
      widths: [30, '*', 90, 'auto', 120],
      heights: globals.cellheight,
      body: renderBody(),
    }, style: 'table'}
  }
  const tableDuration = () => {
    const calcEndDate = () => {
      return {text: moment(state.contractInfo.startDate).add(state.contractInfo.duration, 'M').format("DD-MMMM-YYYY"), alignment: 'center'};
    }
    return {table: {
      widths: ['auto', '*', 'auto', '*', 'auto', 'auto'],
      heights: globals.cellheight,
      body: [
          [ 'Início em', {text: moment(state.contractInfo.startDate).format("DD-MMMM-YYYY"), alignment: 'center'}, 'Término em', calcEndDate(), 'Prazo mínimo de Locação', {text: state.contractInfo.duration + ' meses', alignment: 'center'} ]
        ]
    }, style: 'table'}
  }
  const tableBilling = () => {
    function renderBody(charges) {
      var header = [ ['Número', 'Período', 'Vencimento', 'Descrição da Cobrança', 'Valor'] ];
      var body = charges.map((charge, i, array) => {
        var index = i + "/" + array.length;
        var period = moment(charge.startDate).format("DD-MM-YY") + ' a ' +  moment(charge.endDate).format("DD-MM-YY");
        var endDate = moment(charge.endDate).format("DD-MM-YY");
        var description = charge.description;
        var value = charge.value;
        return [index, period, endDate, description, value];
      });
      var footer = [ [{text: 'Valor Total do Contrato:', colSpan: 4, alignment: 'right', bold: true}, '', '', '', displayValue('rent')] ];
      console.log(header.concat(body, footer));
      return header.concat(body, footer);
    }
    return {table: {
      headerRows: 1,
      widths: ['auto', 'auto', 'auto', '*', 'auto'],
      heights: globals.cellheight,
      body: renderBody(state.billingInfo)
    }, style: 'table'}
  }
  const tableAddress = () => {
    return {table: {
      widths: ['*'],
      heights: globals.cellheight,
      body: [
          [ state.contractInfo.deliveryAddress.street + ', ' + state.contractInfo.deliveryAddress.number + ' - ' + state.contractInfo.deliveryAddress.city + ', ' + state.contractInfo.deliveryAddress.state ]
        ]
    }, style: 'table'}
  }
  const tableRestitution = () => {
    const renderBody = () => {
      var header = [ ['Item', 'Descrição', {text:'Valor Unitário de Indenização', alignment: 'right'}] ];
      var body = state.contractInfo.products.map((product) => {
        return [ product._id, product.name, {text: customTypes.format(product.restitution, 'currency'), alignment: 'right'} ]
      })
      return header.concat(body);
    }
    return {table: {
      headerRows: 1,
      widths: [30, '*', 'auto'],
      heights: globals.cellheight,
      body: renderBody()
    }, style: 'table'}
  }
  const date = () => {
    var date = new Date();
    return {text: `São Paulo, ${date.getDate()} de ${moment(date).format('MMMM')} de ${date.getFullYear()}`, style: 'p', margin: [0, 50, 0, 50]}
  }
  const signatures = () => {
    const repColumn = () => {
      var result;
      switch (representatives.length) {
        case 1:
          result = [
            {text: `__________________________________`, alignment: 'center'},
            {text: representatives[0].name, style: 'sig'},
            {text: `NOME DA EMPRESA`, style: 'sig'},
            {text: `LOCATÁRIA`, style: 'sig'}]
        break;
      case 2:
        result = [{columns: [
            [
              {text: `_____________________`, alignment: 'center'},
              {text: representatives[0].name, style: 'sig'}
            ],

            [
              {text: `_____________________`, alignment: 'center'},
              {text: representatives[1].name, style: 'sig'}
            ]
          ]},
          {text: state.clientInfo.officialName, style: 'sig'},
          {text: `LOCATÁRIA`, style: 'sig'}
        ];
      break;
      }
      return result;
    }
    return {columns: [
      [
        {text: `__________________________________`, alignment: 'center'},
        {text: `Jurgen Nemecek Junior`, style: 'sig'},
        {text: `Locamex Locações e Obras Eireli - EPP`, style: 'sig'},
        {text: `LOCADORA`, style: 'sig'}
      ],
      repColumn()
    ]}
  }
  const tableWitness = () => {
    return {table: {
      widths: ['auto', '*', 'auto', 80, 'auto', 120],
      heights: globals.cellheight,
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
  }
  var docDefinition = {
    pageSize: 'A4',
    pageMargins: [ 40, 60, 40, 30 ], //[left, top, right, bottom]
    info: {
      title: `Contrato Locamex #${state.contractInfo._id}`,
      author: `Locamex`,
      subject: `Contrato de Locação de Bens Móveis e Prestação de Serviços`
    },
    content: [
    {text: `CONTRATO DE LOCAÇÃO DE BENS MÓVEIS E PRESTAÇÃO DE SERVIÇOS Nº ${state.contractInfo._id}`, style: 'h1'},
    {text: `Pelo presente instrumento particular de locação, de um lado a pessoa jurídica LOCAMEX LOCAÇÕES E OBRAS EIRELI – EPP, CNPJ 05.411.043/0001-83, Inscrição Estadual 148.701.950.113 e Inscrição Municipal 3.186.381/7 com sede em Rua Monsenhor Antonio Pepe, nº 52 – Parque Jabaquara – São Paulo – SP – CEP  04357-080, representada neste ato por Jürgen Nemecek Junior, CPF 104.550.568-46, RG 10.937.140-9, órgão expedidor SSP, doravante denominada LOCADORA, e de outro lado a LOCATÁRIA abaixo qualificada:`, style: 'p'},
    tableInformation(),
    {text: `Representada neste ato por:`, style: 'p'},
    tableRepresentative(),
    {text: `que declara estar investido dos poderes necessários para contratar em nome da LOCATÁRIA, assumindo inclusive a qualidade de fiel depositário do Objeto da Locação descrito abaixo, assim como os serviços associados, e estabelecem entre si o presente Contrato de Locação de Bens Móveis e Prestação de Serviços, regido pelas cláusulas e condições a seguir:`, style: 'p'},
    {text: `CLÁUSULA PRIMEIRA - DO OBJETO DO CONTRATO`, style: 'h2'},
    {text: `Por meio deste contrato, que firmam entre si a LOCADORA e a LOCATÁRIA, regula-se a locação dos seguintes bens assim como a prestação de serviços associados.`, style: 'p'},
    {text: `§ 1º. Define-se como Objeto da Locação os seguintes itens, assim como o Valor Mensal de Prorrogação e o Valor Total da Locação:`, style: 'p'},
    tableProducts(),
    {text: `§ 2º. Define-se como Pacote de Serviços os seguintes serviços associados, assim como o Valor Total do Pacote de Serviços:`, style: 'p'},
    tableServices(),
    {text: `§ 3º. Define-se como Valor Total do Contrato a soma do Valor Total da Locação com o Valor Total do Pacote de Serviços.`, style: 'p'},
    {text: `§ 4º. Não está incluso em nenhuma forma neste contrato:`, style: 'p'},
    {ol: [
      `Emissão de ART (Anotação de Responsabilidade Técnica);`,
      `Pagamento de qualquer tipo de taxa junto à Prefeitura do Município;`,
      `Plano de Rigging;`,
      `Linha de Vida;`,
      `Aterramento dos módulos;`,
      `Qualquer outro serviço, insumo, material ou procedimento que não esteja expressamente descrito neste contrato.`
    ], style: 'ol', type: 'upper-roman'},
    {text: `CLÁUSULA SEGUNDA - DO PRAZO DA LOCAÇÃO`, style: 'h2'},
    {text: `O Objeto da Locação ficará sob responsabilidade da LOCATÁRIA durante o período seguinte:`, style: 'p'},
    tableDuration(),
    {text: `§ 1º. O contrato entrará em Prorrogação Automática se não houver manifestação da LOCATÁRIA para retirada do Objeto da Locação feita com mínimo de 15 dias de antecedência do fim do Prazo Mínimo de Locação e o contrato continuará a ser prorrogado a cada 30 dias com prazo indeterminado caso as partes não se manifestem, acompanhado mensalmente da cobrança do Valor Mensal da Locação.`, style: 'p'},
    {text: `§ 2º. Caso a LOCATÁRIA deseje devolver o Objeto da Locação antes do término do Prazo Mínimo de Locação, a LOCATÁRIA deverá notificar a LOCADORA e também efetuar a quitação do Valor Total do Contrato (Cláusula Primeira, § 3º) por completo.`, style: 'p'},
    {text: `CLÁUSULA TERCEIRA - DA COBRANÇA`, style: 'h2'},
    {text: `A LOCATÁRIA se obriga a pagar o Valor Total do Contrato (Cláusula PRIMEIRA, § 3º), da seguinte forma:`, style: 'p'},
    tableBilling(),
    {text: `§ 1º. Em caso de Prorrogação Automática (Cláusula Segunda, § 1º), a LOCADORA está autorizada a emitir cobranças mensais com vencimento no primeiro dia do mês equivalente ao Valor Mensal de Prorrogação (Cláusula Primeira, § 1º) enquanto as partes não se manifestarem para efeito de devolução.`, style: 'p'},
    {text: `§ 2º. Durante a Prorrogação Automática, caso a LOCATÁRIA decida devolver o Objeto da Locação, ela deve informar a LOCADORA com 15 dias de antecedência da próxima prorrogação. Caso expirado tal prazo, a LOCADORA está autorizada a emitir cobrança à LOCATÁRIA equivalente ao Valor Mensal de Prorrogação do mês seguinte.`, style: 'p'},
    {text: `§ 3º. A LOCADORA não permite, sob nenhuma circunstância, qualquer subdivisão, pró-rata ou proporcionalidade do Valor Mensal de Prorrogação, já que este já representa o valor mínimo relativo a qualquer período entre 1 e 30 dias de locação.`, style: 'p'},
    {text: `§ 4º. Em caso de atraso nos pagamentos fica estipulada a multa de 10% sobre o valor em atraso, mais 1% de juros mensais correspondentes aos dias de atraso, assim como correrão por conta da LOCATÁRIA as despesas eventuais de protestos, honorários advocatícios e custas processuais.`, style: 'p'},
    {text: `§ 5º. É facultado à LOCADORA emitir e negociar títulos de cobranças originários deste contrato.`, style: 'p'},
    {text: `§ 6º. A LOCATÁRIA autoriza expressamente a LOCADORA a enviar para Cartório de Protesto os títulos originários deste contrato caso julgue necessário.`, style: 'p'},
    {text: `§ 7º. Fica convencionado e aceito pelas partes que as cobranças referentes a este contrato serão enviadas exclusivamente ao email fornecido pela LOCATÁRIA.`, style: 'p'},
    {text: `CLÁUSULA QUARTA - DA ENTREGA DO OBJETO DA LOCAÇÃO`, style: 'h2'},
    {text: `O Objeto da Locação permanecerá no endereço abaixo:`, style: 'p'},
    tableAddress(),
    {text: `e deverá ser utilizado exclusivamente nesse local, sendo vedada sua movimentação sem prévio consentimento da LOCADORA formalizado por e-mail.`, style: 'p'},
    {text: `§ 1º. A LOCATÁRIA declara ter completa permissão e autorização legal para utilizar o local em questão para instalação do Objeto da Locação por todo o período em que estiver em sua posse, ficando a LOCADORA eximida de toda e qualquer responsabilidade relacionada ao espaço que o Objeto da Locação ocupe.`, style: 'p'},
    {text: `§ 2º. A LOCATÁRIA deverá garantir a plena acessibilidade ao local dos trabalhos, assim como espaço suficiente para posicionamento do caminhão com guindaste e para manobra dos equipamentos.`, style: 'p'},
    {text: `§ 3º. É de responsabilidade da LOCATÁRIA identificar e formalizar imediatamente, por e-mail à LOCADORA, qualquer avaria existente no Objeto da Locação no ato da entrega, visto que a partir da entrega do Objeto da Locação, este passa a estar sob total responsabilidade da LOCATÁRIA e sujeito a indenizações, como definidas na Cláusula Oitava.`, style: 'p'},
    {text: `§ 4º. A LOCATÁRIA, obriga-se a manter no local de entrega um preposto qualificado para coordenar os procedimentos de carga e descarga, de modo a prevenir problemas de qualquer espécie, por toda a duração de tais procedimentos.`, style: 'p'},
    {text: `§ 5º. A demora superior a uma hora nos procedimentos de entrega por item do tipo Loca (Módulo Habitável) contada a partir da chegada do Objeto da Locação segundo o registro do rastreador no caminhão, implicará à LOCATÁRIA o pagamento do custo adicional de R$ 200,00 à LOCADORA por hora excedida, podendo ser cobrado em até 15 dias após o ocorrido.`, style: 'p'},
    {text: `§ 6º. Qualquer viagem e/ou serviço que, por falta de comunicação ou negligência da LOCATÁRIA, se tornar improdutiva no seu objetivo de entrega ou execução gerará à LOCATÁRIA nova cobrança correspondente aos custos da viagem e dos procedimentos improdutivos.`, style: 'p'},
    {text: `CLÁUSULA QUINTA - DA VISTORIA`, style: 'h2'},
    {text: `Para liberação da entrega do Objeto da Locação, será marcada pela LOCADORA uma data onde a LOCATÁRIA fará a visita em um dos pátios da LOCADORA para vistoria do Objeto da Locação e liberação para embarque formalizada e assinada.`, style: 'p'},
    {text: `§ 1º. Caso a LOCATÁRIA deseje, está em seu poder indicar um outro funcionário da empresa da LOCATÁRIA para fazer a vistoria.`, style: 'p'},
    {text: `§ 2º. Se por qualquer motivo a LOCATÁRIA opte por não efetuar a vistoria, a mesma pode dispensar tal formalidade através de um e-mail ou telefonema aprovando a liberação para embarque do Objeto da Locação por sua conta e risco.`, style: 'p'},
    {text: `§ 3º. Com a assinatura da LOCATÁRIA do termo de aprovação de embarque, ou com a aprovação não presencial via email ou telefonema, a LOCADORA fica eximida da obrigação de realizar quaisquer alterações requisitadas pela LOCATÁRIA, podendo essas serem negociadas de forma extracontratual.`, style: 'p'},
    {text: `CLÁUSULA SEXTA - DA UTILIZAÇÃO`, style: 'h2'},
    {text: `A LOCATÁRIA é responsável pela correta utilização do Objeto da Locação, assim como por sua conservação e guarda, e serão de sua exclusiva responsabilidade quaisquer acidentes e/ou problemas com o Objeto da Locação ou por ele causados a terceiros durante todo o período da entrega à devolução, ficando excluída a LOCADORA de qualquer responsabilidade civil ou trabalhista e do pagamento de quaisquer indenizações, seja a que título for, mesmo que geradas por terceiros.`, style: 'p'},
    {text: `§ 1º. É de responsabilidade da LOCATÁRIA executar, se necessárias, as ligações de água fria, rede de esgoto, alimentação elétrica e aterramento dos bens locados, ficando sob sua exclusiva responsabilidade o perfeito funcionamento dessas instalações, eximindo a LOCADORA de tais responsabilidades.`, style: 'p'},
    {text: `§ 2º. A LOCATÁRIA fica expressamente proibida de realizar quaisquer adequações, customizações ou alterações de qualquer natureza no Objeto da Locação a menos que receba autorização da LOCADORA formalizada via e-mail. O descumprimento dessa exigência gerará à LOCATÁRIA a cobrança de custos de restauração das respectivas alterações baseados na tabela de preços da LOCADORA vigente no período do ocorrido.`, style: 'p'},
    {text: `CLÁUSULA SÉTIMA - DA MANUTENÇÃO`, style: 'h2'},
    {text: `É de responsabilidade da LOCADORA a manutenção sem custo adicional somente dos seguintes itens, desde que os problemas emergentes não tenham sido causados por mau uso da LOCATÁRIA ou de terceiros:`, style: 'p'},
    {ol: [
      `Vazamentos em cobertura;`,
      `Troca de equipamento de ar-condicionado;`,
      `Fechaduras de portas e janelas;`,
      `Elétrica: tomadas, disjuntores e iluminação (exceto lâmpadas);`,
      `Estrutura: Completa.`
    ], style: 'ol', type: 'upper-roman'},
    {text: `Parágrafo Único: A  LOCADORA não se responsabiliza pela manutenção de todo e qualquer serviço distinto dos descritos acima, como troca de lâmpadas, desentupimentos de tubulações, pintura, troca de chaves entre outros.`, style: 'p'},
    {text: `CLÁUSULA OITAVA - DO SEGURO E DA INDENIZAÇÃO`, style: 'h2'},
    {text: `É de responsabilidade e custos da LOCATÁRIA a contratação de seguro para o Objeto da Locação.`, style: 'p'},
    {text: `Parágrafo Único: Na hipótese de não devolução, perda, roubo, extravio, ou destruição total dos bens móveis por ora locados, fica estipulada indenização devida pela LOCATÁRIA correspondente ao Valor de Indenização de cada item a ser indenizado, que deverá ser pago à LOCADORA em até 30 dias a partir da data da notificação do sinistro. Transcorridos os 30 dias, caso a LOCATÁRIA não pague o valor indenizatório, a LOCADORA poderá emitir cobranças de locação dos itens que ficaram indisponíveis mês a mês até que o valor de indenização seja quitado.`, style: 'p'},
    tableRestitution(),
    {text: `CLÁUSULA NOVE - DA DEVOLUÇÃO DO OBJETO DE LOCAÇÃO`, style: 'h2'},
    {text: `A LOCATÁRIA deverá comunicar, por e-mail, à LOCADORA o pedido de devolução do Objeto da Locação com antecedência mínima de 15 dias da data de devolução pretendida e efetuar a quitação de quaisquer dívidas e pagamentos em aberto oriundos deste contrato.`, style: 'p'},
    {text: `§ 1º. No momento da retirada do Objeto da Locação, a LOCATÁRIA deverá:`, style: 'p'},
    {ol: [
      `Providenciar a limpeza interna e externa do Objeto da Locação;`,
      `Realizar o desligamento dos pontos de eletricidade, esgoto e água fria;`,
      `Disponibilizar no local um preposto qualificado para auxiliar o procedimento de retirada;`,
      `Garantir acessibilidade ao local de retirada para todo e qualquer procedimento necessário;`,
      `Retirar qualquer publicidade, acessório e/ou decoração inserida no objeto da locação.`
    ], style: 'ol', type: 'upper-roman'},
    {text: `§ 2º. O não atendimento dessas providências facultará à LOCADORA não aceitar a devolução dos equipamentos até que sejam atendidas, assim como a cobrança extra de eventuais períodos de locação, serviços, visitas técnicas, viagens e demais despesas geradas pelo ocorrido.`, style: 'p'},
    {text: `§ 3º. Qualquer viagem e/ou serviço que, por falta de comunicação ou negligência da LOCATÁRIA, se tornar improdutiva no seu objetivo de devolução gerará à LOCATÁRIA nova cobrança correspondente aos custos da viagem e dos procedimentos improdutivos.`, style: 'p'},
    {text: `§ 4º. Ao final da devolução do Objeto da Locação, será realizada pela LOCADORA a inspeção dos itens e, caso constate avarias além do desgaste normal, lhe estará facultado enviar à LOCATÁRIA um relatório de avarias, cabendo à LOCATÁRIA, dentro de um prazo máximo de 10 dias, optar por, necessariamente, uma das duas alternativas abaixo:`, style: 'p'},
    {ol: [
      `Realizar pagamento à LOCADORA pelos Serviços de Reparo dos itens, de acordo com a tabela de preços, fornecida pela LOCADORA, vigente no dia da devolução;`,
      `Executar os Serviços de Reparo por sua conta ou mediante a contratação de terceiros.`
    ], style: 'ol', type: 'upper-roman'},
    {text: `§ 5º. Esgotado o prazo de 10 dias, a LOCADORA fica autorizada a emitir cobrança relativa aos Serviços de Reparo dos itens, assim como a cobrança extra correspondente ao Valor Unitário Mensal (Cláusula 1ª, § 1º) dos itens danificados em questão, oriunda dos custos gerados pela inatividade dos bens móveis.`, style: 'p'},
    {text: `CLÁUSULA DEZ - DA VEDAÇÃO À SUBLOCAÇÃO, À CESSÃO DE LOCAÇÃO E AO EMPRÉSTIMO A TERCEIROS`, style: 'h2'},
    {text: `Fica vedada à LOCATÁRIA a sublocação, cessão, ou empréstimo do Objeto da Locação, quer no todo ou em parte ou sob qualquer título, sem a expressa autorização da LOCADORA, sob pena de rescisão do presente contrato.`, style: 'p'},
    {text: `CLÁUSULA ONZE - DA RECISÃO`, style: 'h2'},
    {text: `Em caso de rescisão antecipada do contrato antes do seu termo final, independente de qual parte deu causa à rescisão, a LOCATÁRIA se obriga a quitar quaisquer dívidas oriundas deste contrato, incluindo mas não se limitando ao Valor Total do Contrato, Valores de Indenização (se cabíveis), Valores dos Serviços de Reparo (se cabíveis) e do Valor Mensal de Prorrogação (se cabível), sem nenhuma forma de proporcionalidade ou desconto, dentro de um prazo de 30 dias a contar a partir da rescisão.`, style: 'p'},
    {text: `Parágrafo Único: Em cumprimento ao princípio da boa-fé, as partes se comprometem a informar uma à outra qualquer fato que possa porventura intervir na relação jurídica travada neste contrato.`, style: 'p'},
    {text: `CLÁUSULA DOZE - DO FORO`, style: 'h2'},
    {text: `Para reger as demandas oriundas do presente instrumento, as partes elegem como foro competente o da Comarca da Capital de São Paulo, renunciando a qualquer outro, por mais privilegiado que seja ou que possa vir a ser.`, style: 'p'},
    {text: `E por terem assim ajustado e contratado, ambas as partes assinam este Instrumento em duas vias de igual valor e teor.`, style: 'p'},
    date(),
    signatures(),
    {text: `Testemunhas:`, style: 'p', margin: [0, 50, 0, 0]},
    tableWitness()
// End of body ----------------------------------------------------------------------------
  ],
  footer: function(currentPage, pageCount) {
    return {text: currentPage.toString(), style: 'footer'};
  },
  styles: {
    h1: {
      fontFamily: globals.fontFamily,
      fontSize: globals.h1Size,
      bold: true,
      alignment: 'center',
      margin: [0, 0, 0, globals.marginBottom]
    },
    h2: {
      fontFamily: globals.fontFamily,
      fontSize: globals.h2Size,
      bold: true,
      alignment: 'justify',
      margin: [0, 0, 0, globals.marginBottom]
    },
    p: {
      fontFamily: globals.fontFamily,
      fontSize: globals.pSize,
      alignment: 'justify',
      margin: [0, 0, 0, globals.marginBottom]
    },
    table: {
      fontFamily: globals.fontFamily,
      fontSize: globals.pSize,
      alignment: 'left',
      margin: [0, 0, 0, globals.marginBottom]
    },
    ol: {
      fontFamily: globals.fontFamily,
      fontSize: globals.pSize,
      margin: [30, 0, 0, globals.marginBottom]
    },
    sig: {
      fontFamily: globals.fontFamily,
      fontSize: globals.pSize,
      alignment: 'center',
      margin: [0, 0, 0, 0]
    },
    footer: {
      fontFamily: globals.fontFamily,
      fontSize: globals.pSize,
      alignment: 'center',
      margin: [ 0, 0, 0, 0 ]
    }
  }
};
  pdfMake.createPdf(docDefinition).download();
}