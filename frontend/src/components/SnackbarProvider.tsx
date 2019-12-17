import * as React from 'react';
import { IconButton, makeStyles, Theme } from '@material-ui/core';
import { SnackbarProvider as NoteStackProvider, SnackbarProviderProps} from 'notistack';
import CloseIcon from '@material-ui/icons/Close';


const useStyles = makeStyles((theme: Theme) => {
    return {
        variantSucess:{
            backgroundColor: theme.palette.success!.main
        },
        variantError:{
            backgroundColor: theme.palette.error.main
        },
        variantInfo:{
            backgroundColor: theme.palette.primary.main 
        }

    }
});

const SnackbarProvider: React.FC<SnackbarProviderProps> = (props)=>{
    let snackBarProviderRef;
    const classes = useStyles();
    const defaultProps: SnackbarProviderProps = {
        classes,
        autoHideDuration: 3000,
        maxSnack: 3,
        anchorOrigin: {
            horizontal: 'right',
            vertical: 'top'
        },
        ref: (el) => snackBarProviderRef= el,
        action: (key)=> (
        <IconButton color='inherit' style={{fontSize: 20}} onClick={()=> snackBarProviderRef.closeSnackbar(key)}> 
            <CloseIcon/>
        </IconButton>)
    }

    const newProps = {...defaultProps, ...props};

    return (
        <NoteStackProvider {...newProps}>
            {props.children}
        </NoteStackProvider>
        
    )
}

export default SnackbarProvider;