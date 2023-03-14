import React from 'react';
import Chart from './Components/Chart';
import Market from './Components/Market';
import Modes from './Components/Modes';
import Orders from './Components/Orders';
import Position from './Components/Positions';

import {
  WrapperContent,
  WrapperContentLeft,
  WrapperContentChart,
  WrapperContentRight,
  WrapperContentOrder
} from './Content.style';

export default function ContentPage() {
  return (
    <WrapperContent>
      <WrapperContentLeft>
        <WrapperContentChart>
          <Position />
          <Chart />
        </WrapperContentChart>
        <WrapperContentOrder>
          <Market />
          <Orders />
          <Modes />
        </WrapperContentOrder>
      </WrapperContentLeft>
      <WrapperContentRight />
    </WrapperContent>
  );
}
