import React from 'react';
import { Link } from 'react-router';

export default function NotFound () {
  return (
    <div className="center__background">
      <div className="not-found__box">
        <h1>Erro 404</h1>
        <p>Página não encontrada. Favor verificar se o link existe.</p>
        <Link to="/" className="button button--link">Voltar</Link>
      </div>
    </div>
  )
}