import * as React from 'react';
import {useEffect, useState} from 'react';
import { TextField, makeStyles, Theme, FormLabel, RadioGroup, FormControlLabel, Radio, FormControl, FormHelperText } from '@material-ui/core';
import useForm from "react-hook-form";
import castMemberHttp from '../../util/http/cast-member-http';
import * as yup from '../../util/vendor/yup';
import { useParams, useHistory } from 'react-router';
import {useSnackbar} from "notistack"
import { CastMember } from '../../util/models';
import SubmitActions from '../../components/SubmitActions';

const useStyles = makeStyles((theme:Theme)=> {
    return {
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
    const {id} = useParams();
    const { register,
        handleSubmit, 
        getValues,
        setValue, 
        errors, 
        reset, 
        watch,
        triggerValidation
    } = useForm({
        validationSchema,
        defaultValues: {
            type: id?"":"0"
        }
        
    });

    const snackbar = useSnackbar();
    const history = useHistory();
    
    const [castMember, setCastMember] = useState<CastMember | null>(null)
    // const [type, setType] = useState("0");
    const [loading, setLoading] = useState<boolean>(false)

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
            
            snackbar.enqueueSnackbar('Não foi possível salvar este Membro de elenco',{
                variant: 'error',
            })
        })
        .finally(()=>setLoading(false));
    }
    
    const handleChange = event => {
        console.log(event.target);
        setValue(event.target.name, event.target.value, false);
        
    };

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
        <FormControl margin={'normal'} component="fieldset" className={classes.formControl} disabled={loading} error={errors.type !== undefined}
>
            <FormLabel component="legend">Tipo</FormLabel>
            
            <RadioGroup value={watch('type')} aria-label="gender" name="type" onChange={handleChange}>
            <FormControlLabel value="0" control={<Radio color={"primary"}/>} label="Ator" />
            <FormControlLabel value="1" control={<Radio color={"primary"} />} label="Editor" />
            
            </RadioGroup>

            {
                errors.type && <FormHelperText id="type-helper-text">{errors.type.message}</FormHelperText>
            }
            
        </FormControl>
        

        <SubmitActions 
                disabledButtons={loading} 
                handleSave={() => triggerValidation().then( isValid => {
                    isValid && onSubmit(getValues(), null)}
                ) }/>

        </form>
    );
}

export default Form;