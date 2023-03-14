import { createGlobalStyle } from 'styled-components';
import colors from '@styles/theme/colors.js';
import fontStyles from '@styles/theme/fontStyles.js';

const AppGlobalStyle = createGlobalStyle`
  ${colors}
  ${fontStyles}`;

export default AppGlobalStyle;
