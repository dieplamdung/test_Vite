import { memo } from 'react';
import PropTypes from 'prop-types';
import { StyledPnLWrapper, StyledPnLBox, StyledPnLTitle, StyledPnLValue } from './PnLBox.style';

const PnLBox = ({ title, value, color, direction = 'horizontal', ...restProps }) => {
  return (
    <StyledPnLWrapper {...restProps}>
      <StyledPnLBox direction={direction}>
        <StyledPnLTitle>
          <p>{title}</p>
        </StyledPnLTitle>
        <StyledPnLValue isEmpty={!value} color={color}>
          {value && <p>{value}</p>}
        </StyledPnLValue>
      </StyledPnLBox>
    </StyledPnLWrapper>
  );
};

PnLBox.defaultProps = {
  title: '',
  value: '',
  color: '',
  direction: 'horizontal'
};

PnLBox.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string,
  color: PropTypes.string,
  direction: PropTypes.oneOf(['horizontal', 'vertical'])
};

export default memo(PnLBox);
