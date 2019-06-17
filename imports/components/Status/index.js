import React from 'react';

export default function Status(props) {
  var className = "";
  var label = "";
  var status = props.status;

  if (props.type === "proposal") {
    if (status === "inactive") status = "inProgress";
    if (status === "active") status = "closed";
    if (status === "cancelled") status = "cancelled_A";
  }

  switch (status) {
    case 'inProgress':
      className = "status--in-progress";
      label = "Em Andamento";
      break;
    case 'closed':
      className = "status--closed";
      label = "Fechada";
      break;
    case 'inactive':
      className = "status--inactive";
      label = "Inativo";
      break;
    case 'active':
      className = "status--active";
      label = "Ativo";
      break;
    case 'cancelled_A':
      className = "status--cancelled";
      label = "Cancelada";
      break;
    case 'cancelled':
      className = "status--cancelled";
      label = "Cancelado";
      break;
    case 'prorogation':
      className = "status--in-progress";
      label = "Em Prorrogação";
      break;
    case 'finalized':
      className = "status--finalized";
      label = "Finalizado";
      break;
  }
  return (
    <span className={className}><strong>{label}</strong></span>
  )
}