import * as React from 'react';
import { Chip, createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import theme from '../theme';

const localTheme = createMuiTheme({
    palette:{
        primary: theme.palette.success,
        secondary: theme.palette.error,
    }
})



type Props = {
    label: String
}

export const BadgeYes: React.FC<Props> = (props)=>{
    
    return (
        <MuiThemeProvider theme={localTheme}>
            <Chip label={props.label} color="primary"/>
        </MuiThemeProvider>
        
    )
}

export const BadgeNo: React.FC<Props> = (props)=>{
    
    return (
        <MuiThemeProvider theme={localTheme}>
            <Chip label={props.label} color="secondary"/>
        </MuiThemeProvider>
    )
}