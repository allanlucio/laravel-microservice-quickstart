// import './App.css';
import { Box, CssBaseline, MuiThemeProvider } from '@material-ui/core';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Breadcrumbs from './components/breadcrumbs';
import { LoadingProvider } from './components/loading/LoadingProvider';
import { Navbar } from './components/Navbar';
import SnackbarProvider from './components/SnackbarProvider';
import { Spinner } from './components/Spinner';
import AppRouter from './routes/AppRouter';
import theme from './theme';

const App: React.FC = () => {
  return (
    <React.Fragment>
      <LoadingProvider >
        <MuiThemeProvider theme={theme}>
          <SnackbarProvider>
            <CssBaseline />
            <BrowserRouter>
              <Spinner />
              <Navbar></Navbar>
              <Box
                paddingTop={'60px'}>
                <Breadcrumbs />
                <AppRouter />
              </Box>

            </BrowserRouter>
          </SnackbarProvider>
        </MuiThemeProvider>
      </LoadingProvider>
    </React.Fragment>
  );
}

export default App;
