import React, { useState } from 'react';
import Mode from './Components/Mode';
import Sweep from './Components/Sweep';
import { Title, WrapperContentMode, WrapperContentModes, WrapperTitle } from './styled';

export default function Modes() {
  const [type, setType] = useState('sweep');
  return (
    <WrapperContentMode>
      <WrapperTitle>
        <Title isselect={type === 'sweep'} onClick={() => setType('sweep')}>
          Sweep Mode
        </Title>
        <Title isselect={type === 'mode'} onClick={() => setType('mode')}>
          Pro Mode
        </Title>
      </WrapperTitle>
      <WrapperContentModes>
        {type === 'sweep' && <Sweep />}
        {type === 'mode' && <Mode />}
      </WrapperContentModes>
    </WrapperContentMode>
  );
}
