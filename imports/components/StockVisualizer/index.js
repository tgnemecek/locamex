import React from 'react';

import RegularStockVisualizer from './RegularStockVisualizer/index';
import VariationsStockVisualizer from './VariationsStockVisualizer/index';
import BuySell from './BuySell/index';
import PlacesBlock from './PlacesBlock/index';

export default function StockVisualizer(props) {
  if (props.item.variations) {
    return <VariationsStockVisualizer {...props} BuySell={BuySell} PlacesBlock={PlacesBlock} />
  } else return <RegularStockVisualizer {...props} BuySell={BuySell} PlacesBlock={PlacesBlock} />
}