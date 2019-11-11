import React from 'react';
import logo from './logo.svg';
// import './App.css';
import {Button, Box} from '@material-ui/core';
import { Navbar } from './components/Navbar';
import { Page } from './components/Page';
const App: React.FC = () => {
  return (
    <React.Fragment>
      <Navbar></Navbar>
      <Box 
        paddingTop={'120px'}
      >
        <Page title={"Hello World"}>
          Conteudo
        </Page>
      </Box>
      
    </React.Fragment>
  );
}

export default App;
