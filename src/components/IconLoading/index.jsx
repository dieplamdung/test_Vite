import React from 'react';
import styled, { keyframes } from 'styled-components';
import iconLoading from '../../assets/loading.svg';

export default function IconLoading() {
  return (
    <WrapperIcon className="style-icon-loading">
      <img src={iconLoading} alt="" />
    </WrapperIcon>
  );
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const WrapperIcon = styled.div`
  width: 24px;
  height: 24px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    animation: ${rotate} 2s linear infinite;
  }
`;
