import React from 'react';
import logo from './logo.svg';
// import './App.css';
import {Button, Box} from '@material-ui/core';
import { Navbar } from './components/Navbar';
import { Page } from './components/Page';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import Breadcrumbs from './components/breadcrumbs';
const App: React.FC = () => {
  return (
    <React.Fragment>
      <BrowserRouter>
      <Navbar></Navbar>
      <Box 
        paddingTop={'120px'}>
          <Breadcrumbs/>
        <AppRouter/>
      </Box>
      
      </BrowserRouter>
      
      
    </React.Fragment>
  );
}

export default App;
