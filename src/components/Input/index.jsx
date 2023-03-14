import React from 'react';
import styled from 'styled-components';

// interface
/**
 *
 * @param {*, percent} props
 * @returns
 */
export default function Input(props) {
  return (
    <WrapperInput className={`wrapper-${props?.className}`}>
      <InputContent {...props} />
      {props?.percent && <Percent>%</Percent>}
    </WrapperInput>
  );
}

const WrapperInput = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: fit-content;
  height: 30px;
  background: #2d3236;
  padding: 0px 8px;
  width: 130px;
`;

const InputContent = styled.input`
  width: 100%;
  height: 100%;
  background: transparent;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;

  border: none;
  text-align: end;

  :focus {
    border: none;
    outline: none;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const Percent = styled.p`
  width: fit-content;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;
