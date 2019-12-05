import * as React from 'react';
import {useEffect} from 'react';
import { TextField, Box, Button, makeStyles, Theme, FormLabel, RadioGroup, FormControlLabel, Radio, FormControl } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import useForm from "react-hook-form";
import castMemberHttp from '../../util/http/cast-member-http';


const useStyles = makeStyles((theme:Theme)=> {
    return {
        submit: {
            margin: theme.spacing(1)
        },
        formControl: {
            margin: theme.spacing(3),
        },
    }
})

export const Form: React.FC = ()=>{
    const classes = useStyles();
    const buttonProps: ButtonProps ={
        variant: 'contained',
        color: 'secondary',
        className: classes.submit
        
    }

    const {register, handleSubmit, getValues, setValue, errors} = useForm({
        defaultValues: {
            type: 0
        }
    })

    useEffect(() => {
        register({ name: 'type'})
    }, [register])

    function onSubmit(formData, event){
        castMemberHttp.create(formData).then((response)=> console.log(response));
    }
    const handleChange = event => {
        setValue(event.target.name, parseInt(event.target.value), true);
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                inputRef={register}
                name='name'
                label='Nome'
                fullWidth
                variant={'outlined'}
            />
        <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Tipo</FormLabel>
            
            <RadioGroup aria-label="gender" name="type" onChange={handleChange}>
            <FormControlLabel value="0" control={<Radio color={"primary"}/>} label="Ator" />
            <FormControlLabel value="1" control={<Radio color={"primary"} />} label="Editor" />
            
            </RadioGroup>
            
        </FormControl>
        

            <Box dir={"rtl"}>
                <Button {... buttonProps} onClick={() => onSubmit(getValues(), null)}> Salvar</Button>
                <Button {... buttonProps} type="submit"> Salvar e continuar editando</Button>
                
            </Box>

        </form>
    );
}

export default Form;