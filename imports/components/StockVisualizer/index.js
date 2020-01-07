import React from 'react';

import Box from '/imports/components/Box/index';
import RegularStockVisualizer from './RegularStockVisualizer/index';
import VariationsStockVisualizer from './VariationsStockVisualizer/index';
import BuySell from './BuySell/index';
import PlacesBlock from './PlacesBlock/index';

export default function StockVisualizer(props) {
  return (
    <Box
      title="Visualizador de Estoque"
      className="stock-visualizer"
      closeBox={props.toggleWindow}>
      {props.item.variations ?
        <VariationsStockVisualizer
          {...props}
          BuySell={BuySell}
          PlacesBlock={PlacesBlock}/>
      :
        <RegularStockVisualizer
          {...props}
          BuySell={BuySell}
          PlacesBlock={PlacesBlock}/>
      }
    </Box>
  )
}