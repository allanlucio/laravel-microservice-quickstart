// @flow 
import * as React from 'react';
import { Box, Button, Theme, makeStyles } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';

const useStyles = makeStyles((theme:Theme)=> {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    }
})

interface SubmitActionsProps{
    disabledButtons?: boolean;
    handleSave: () => void;

}

const SubmitActions : React.FC<SubmitActionsProps> = (props) => {
    const classes = useStyles();

    const buttonProps: ButtonProps = {
        variant: 'contained',
        color: 'secondary',
        className: classes.submit,
        disabled: props.disabledButtons === undefined ? false: props.disabledButtons
        
    }
    return (
        <Box dir={"rtl"}>
                <Button 
                    color={'primary'} 
                    {... buttonProps} 
                    onClick={props.handleSave}
                    > 
                        Salvar
                
                </Button>
                
                <Button 
                {... buttonProps} 
                type="submit"
                > 
                    Salvar e continuar editando
                
                </Button>
                
        </Box>
    );
};

export default SubmitActions;