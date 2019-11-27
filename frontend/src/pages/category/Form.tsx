import * as React from 'react';
import { TextField, Checkbox, Box, Button, makeStyles, Theme } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import useForm from "react-hook-form";

const useStyles = makeStyles((theme:Theme)=> {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    }
})

export const Form: React.FC = ()=>{
    const classes = useStyles();
    const buttonProps: ButtonProps ={
        variant: 'outlined',
        className: classes.submit
        
    }

    const {register, getValues} = useForm()

    return (
        <form>
            <TextField
                inputRef={register}
                name='name'
                label='Nome'
                fullWidth
                variant={'outlined'}
            />
            <TextField
                inputRef={register}
                name='description'
                label='Descrição'
                multiline
                rows="4"
                fullWidth
                variant={'outlined'}
                margin={"normal"}
            />

            <Checkbox
                inputRef={register}
                name="is_active"
            />Ativo?

            <Box dir={"rtl"}>
                <Button {... buttonProps}> Salvar</Button>
                <Button {... buttonProps} type="submit"> Salvar e continuar editando</Button>
                
            </Box>

        </form>
    );
}

export default Form;