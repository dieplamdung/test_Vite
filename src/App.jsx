import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { WalletProvider } from '@contexts/walletContext';
import AppGlobalStyle from '@styles/AppGlobalStyle';
import * as theme from '@styles/theme';
import Home from '@pages/Home';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <WalletProvider>
        <Router>
          <AppGlobalStyle />
          <Routes>
            <Route exact path="/" element={<Home />} />
          </Routes>
        </Router>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App;
