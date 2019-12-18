import * as React from 'react';
import {useEffect,useState} from 'react';
import { TextField, Checkbox, Box, Button, makeStyles, Theme, FormControlLabel } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import useForm from "react-hook-form";
import categoryHttp from '../../util/http/category-http';
import * as yup from '../../util/vendor/yup';
import { useParams, useHistory } from 'react-router';
import {useSnackbar} from "notistack"
const useStyles = makeStyles((theme:Theme)=> {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    }
})

const validationSchema = yup.object().shape({
    name: yup
            .string()
            .label("Nome")
            .required()
            .max(255)
});

export const Form: React.FC = ()=>{

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
                is_active: true
            }
    })

    const classes = useStyles();
    const snackbar = useSnackbar();
    const history = useHistory();
    const {id} = useParams();
    const [category, setCategory] = useState<{id: string} | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const buttonProps: ButtonProps = {
        variant: 'contained',
        color: 'secondary',
        className: classes.submit,
        disabled: loading
        
    }

    

    useEffect(() => {
        register({name: "is_active"});
    }, [register])

    useEffect(() => {
        if(!id){
            return ;
        }

        (async function getCategory(){
            setLoading(true);
            try {
                const {data} = await categoryHttp.get(id);
                setCategory(data.data)
                reset(data.data);
            } catch (error) {
                console.error(error);
                snackbar.enqueueSnackbar(
                    "Não foi possível carregar as informações",
                    {variant: 'error'}
                );
            }finally{
                setLoading(false);
            }

        })();
        // getCategory();
        
    }, []);

    async function onSubmit(formData, event){
        setLoading(true);
        try{
            const http = category ? 
            categoryHttp.update(category.id,formData):
            categoryHttp.create(formData);

            const {data} = await http;
            snackbar.enqueueSnackbar('Categoria Salva com Sucesso!',{
                variant: 'success',
            });
            setTimeout(()=>{
                event ? (
                    id? history.replace(`/categories/${data.data.id}/edit`): history.push(`/categories/${data.data.id}/edit`)
                ): history.push('/categories')
            });
        } catch(error){
            console.error(error);
            snackbar.enqueueSnackbar('Não foi possível salvar esta categoria',{
                variant: 'error',
            })
        }finally{
            setLoading(false);
        }
        

        // http.then(({data})=> {
        //     snackbar.enqueueSnackbar('Categoria Salva com Sucesso!',{
        //         variant: 'success',
        //     })
        //     setTimeout(()=>{
        //         event ? (
        //             id? history.replace(`/categories/${data.data.id}/edit`): history.push(`/categories/${data.data.id}/edit`)
        //         ): history.push('/categories')
        //     })
            

        // })
        // .catch((error)=> {
            
        //     snackbar.enqueueSnackbar('Não foi possível salvar esta categoria',{
        //         variant: 'error',
        //     })
        // })
        // .finally(()=>setLoading(false));
    }

    console.log(errors);
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
            
            <TextField
                inputRef={register}
                name='description'
                label='Descrição'
                multiline
                rows="4"
                fullWidth
                variant={'outlined'}
                margin={"normal"}
                InputLabelProps={{shrink: true}}
                disabled={loading}
            />

            <FormControlLabel
                control={
                    <Checkbox
                    
                    name="is_active"
                    checked={watch("is_active")}
                    onChange={()=>setValue('is_active', !getValues()['is_active'])}
                    color={"primary"}
                    
                />
                }
                label="Ativo?"
                labelPlacement="end"
                disabled={loading}
            />
                
            
            

            <Box dir={"rtl"}>
                <Button color={'primary'} {... buttonProps} onClick={() => onSubmit(getValues(), null)}> Salvar</Button>
                <Button {... buttonProps} type="submit"> Salvar e continuar editando</Button>
                
            </Box>

        </form>
    );
}

export default Form;