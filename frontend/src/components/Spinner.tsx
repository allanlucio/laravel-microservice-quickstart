// @flow 
import * as React from 'react';
import { LinearProgress, MuiThemeProvider, Theme, Fade } from '@material-ui/core';
import { type } from 'os';
import { red } from '@material-ui/core/colors';
import LoadingContext from './loading/LoadingContext';

function makeLocalTheme(theme: Theme) {
    return {
        ...theme,
        pallete: {
            ...theme.palette,
            primary: theme.palette.error,
            type: 'dark'
        }
    }
}

export const Spinner = () => {
    const loading = React.useContext(LoadingContext);

    return (
        <MuiThemeProvider theme={makeLocalTheme}>
            <Fade in={loading}>
                <LinearProgress
                    style={{
                        position: "fixed",
                        width: '100%',
                        zIndex: 9999,
                        backgroundColor: red[800]
                    }}
                >

                </LinearProgress>
            </Fade>
        </MuiThemeProvider>

    );
};