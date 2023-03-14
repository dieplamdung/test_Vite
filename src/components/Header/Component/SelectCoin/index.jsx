import { MenuItem, Select } from '@mui/material';
import React, { useState } from 'react';
import { WrapperInput, WrapperSelectCoin } from './styled';
import Icon from '../../../../assets/icon.png';
import Input from '../../../Input';
export default function SelectCoin() {
  const [valueSelect, setValueSelect] = useState('USDC');

  const LIST_COIN = [
    {
      icon: Icon,
      label: 'USDC',
      value: 'USDC'
    },
    {
      icon: Icon,
      label: 'USDC_SPL',
      value: 'USDC_SPL'
    }
  ];

  return (
    <WrapperSelectCoin>
      <Select
        value={valueSelect}
        onChange={(e) => {
          setValueSelect(e?.target?.value);
        }}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}>
        {LIST_COIN.map((item) => {
          return (
            <MenuItem
              key={item.value}
              value={item.value}
              sx={{
                display: 'flex',
                alignItems: 'center',
                fontWeight: '400',
                fontSize: '14px',
                lineHeight: '16px',

                '& img': {
                  marginRight: '6px'
                },

                '& p': {
                  margin: '0px',
                  padding: '4px 0px'
                }
              }}>
              <img src={item.icon} className="icon-coin" alt="" />
              <p>{item.label}</p>
            </MenuItem>
          );
        })}
      </Select>
      <WrapperInput>
        <Input className="value-coin-select" type="number" />
      </WrapperInput>
    </WrapperSelectCoin>
  );
}
