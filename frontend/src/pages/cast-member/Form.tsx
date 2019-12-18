import * as React from 'react';
import {useEffect, useState} from 'react';
import { TextField, Box, Button, makeStyles, Theme, FormLabel, RadioGroup, FormControlLabel, Radio, FormControl } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import useForm from "react-hook-form";
import castMemberHttp from '../../util/http/cast-member-http';
import * as yup from '../../util/vendor/yup';
import { useParams, useHistory } from 'react-router';
import {useSnackbar} from "notistack"

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

const validationSchema = yup.object().shape({
    name: yup
            .string()
            .label("Nome")
            .required()
            .max(255),
    type: yup
            .string()
            .label("Tipo")
            .required()
});

export const Form: React.FC = ()=>{
    const classes = useStyles();
    const { register,
        handleSubmit, 
        getValues,
        setValue, 
        errors, 
        reset, 
        watch
    } = useForm({
        validationSchema,
        defaultValues: {
            type: "0"
        }
        
    });

    const snackbar = useSnackbar();
    const history = useHistory();
    const {id} = useParams();
    const [castMember, setCastMember] = useState<{id: string} | null>(null)
    // const [type, setType] = useState("0");
    const [loading, setLoading] = useState<boolean>(false)
    const buttonProps: ButtonProps ={
        variant: 'contained',
        color: 'secondary',
        className: classes.submit,
        disabled: loading
        
    }


    useEffect(() => {
        register({ name: 'type'})
    }, [register]);
    useEffect(() => {
        if(!id){
            return ;
        }
        setLoading(true)
        castMemberHttp.get(id).then(({data}) => {
            setCastMember(data.data)
            
            data.data["type"] = data.data["type"]+"";
            console.log(data.data);
            // setType(data.data["type"]);
            reset(data.data);
        }).finally(()=> setLoading(false));
    }, []);

    function onSubmit(formData, event){
        setLoading(true);
        const http = castMember ? 
            castMemberHttp.update(castMember.id,formData):
            castMemberHttp.create(formData);

        http.then(({data})=> {
            snackbar.enqueueSnackbar('Membro de elenco Salvo com Sucesso!',{
                variant: 'success',
            })
            setTimeout(()=>{
                event ? (
                    id? history.replace(`/cast-members/${data.data.id}/edit`): history.push(`/cast-members/${data.data.id}/edit`)
                ): history.push('/cast-members')
            })
            

        })
        .catch((error)=> {
            
            snackbar.enqueueSnackbar('Não foi possível salvar esta categoria',{
                variant: 'error',
            })
        })
        .finally(()=>setLoading(false));
    }
    
    const handleChange = event => {
        console.log(event.target);
        setValue(event.target.name, event.target.value, false);
        
    };

    
    // const type = watch('type') || "0";
    // console.log(type);
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                inputRef={register}
                name='name'
                label='Nome'
                fullWidth
                variant={'outlined'}
                error={errors.name !== undefined}
                helperText={errors.name && errors.name.message}
                InputLabelProps={{shrink: true}}
                disabled={loading}
            />
        <FormControl component="fieldset" className={classes.formControl} disabled={loading}>
            <FormLabel component="legend">Tipo</FormLabel>
            
            <RadioGroup value={watch('type')} aria-label="gender" name="type" onChange={handleChange}>
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