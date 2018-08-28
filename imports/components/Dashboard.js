import React from 'react';

import AppHeader from './AppHeader';

export default () => {
  return(
    <div>
      <AppHeader title="Dashboard"/>
      <div className="page-content">
        Dashboard page content.
      </div>
    </div>
  );
};