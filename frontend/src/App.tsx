import React from 'react';
import logo from './logo.svg';
// import './App.css';
import {Button, Box, MuiThemeProvider, CssBaseline} from '@material-ui/core';
import { Navbar } from './components/Navbar';
import { Page } from './components/Page';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import Breadcrumbs from './components/breadcrumbs';
import theme from './theme';
import SnackbarProvider from './components/SnackbarProvider';

const App: React.FC = () => {
  return (
    <React.Fragment>
      <MuiThemeProvider theme={theme}> 
        <SnackbarProvider>
          <CssBaseline/>
          <BrowserRouter>
          <Navbar></Navbar>
          <Box 
            paddingTop={'60px'}>
              <Breadcrumbs/>
            <AppRouter/>
          </Box>
          
          </BrowserRouter>
        </SnackbarProvider>
      </MuiThemeProvider>
      
    </React.Fragment>
  );
}

export default App;
