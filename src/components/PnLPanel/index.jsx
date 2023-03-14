import { memo } from 'react';
import PropTypes from 'prop-types';
import PnLBox from '@components/PnLBox';
import { StyledPnLPanel } from './PnLPanel.style';

export const PnLPanel = ({ data, direction, ...restProps }) => {
  const {
    requiredMargin = '',
    excessMargin = '',
    positionValue = '',
    collateralNUnrealizedPnL = '',
    leverageOrEffective = '',
    health = '',
    pnl = ''
  } = { ...data };

  return (
    <StyledPnLPanel direction={direction} {...restProps}>
      <PnLBox
        title="Required Margin"
        value={requiredMargin}
        direction={direction}
        color={'#096C7B'}
      />
      <PnLBox title="Excess Margin" value={excessMargin} direction={direction} color={'#096C7B'} />
      <PnLBox
        title="Position Value"
        value={positionValue}
        direction={direction}
        color={'#FFFFFF'}
      />
      {direction === 'horizontal' && (
        <PnLBox title="Total PnL" value={pnl} direction={direction} color={'#FFFFFF'} />
      )}
      <PnLBox
        title="Collateral + Unrealized PnL"
        value={collateralNUnrealizedPnL}
        direction={direction}
        color={'#FFFFFF'}
      />
      <PnLBox
        title="Leverage (Effective)"
        value={leverageOrEffective}
        direction={direction}
        color={'#FFFFFF'}
      />
      <PnLBox title="Health" value={health} direction={direction} color={'#FFFFFF'} />
      {direction === 'vertical' && (
        <PnLBox title="Total PnL" value={pnl} direction={direction} color={'#A23D52'} />
      )}
    </StyledPnLPanel>
  );
};

PnLPanel.defaultProps = {
  data: {
    requiredMargin: '',
    excessMargin: '',
    positionValue: '',
    collateralNUnrealizedPnL: '',
    leverageOrEffective: '',
    health: '',
    pnl: ''
  },
  direction: 'horizontal'
};

PnLPanel.propTypes = {
  data: PropTypes.shape({
    requiredMargin: PropTypes.object,
    excessMargin: PropTypes.object,
    positionValue: PropTypes.object,
    collateralNUnrealizedPnL: PropTypes.object,
    leverageOrEffective: PropTypes.object,
    health: PropTypes.object,
    pnl: PropTypes.object
  }),
  direction: PropTypes.string,
  restProps: PropTypes.node
};

export default memo(PnLPanel);
