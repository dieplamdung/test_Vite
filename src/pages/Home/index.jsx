import { Container } from './Home.style';
import React from 'react';
import Header from '../../components/Header';
import ContentPage from '../../components/ContentPage';

const Home = () => {
  return (
    <Container>
      <Header />
      <ContentPage />
    </Container>
  );
};

export default Home;
