import * as React from 'react';
import {useEffect,useState, useContext} from 'react';
import { TextField, Checkbox, Box, Button, makeStyles, Theme, FormControlLabel, Grid } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import useForm from "react-hook-form";
import categoryHttp from '../../util/http/category-http';
import * as yup from '../../util/vendor/yup';
import { useParams, useHistory } from 'react-router';
import {useSnackbar} from "notistack"
import { Category } from '../../util/models';
import SubmitActions from '../../components/SubmitActions';
import { DefaultForm } from '../../components/DefaultForm';
import LoadingContext from '../../components/loading/LoadingContext';



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
            watch,
            triggerValidation
        } = useForm({
            validationSchema,
            defaultValues: {
                is_active: true
            }
    })

    const snackbar = useSnackbar();
    const history = useHistory();
    const {id} = useParams();
    const [category, setCategory] = useState<Category | null>(null)
    const loading = useContext(LoadingContext);

    useEffect(() => {
        register({name: "is_active"});
    }, [register])

    useEffect(() => {
        if(!id){
            return ;
        }

        (async function getCategory(){
            
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
            }

        })();
        // getCategory();
        
    }, []);

    async function onSubmit(formData, event){
        
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
        <DefaultForm>
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
                        
                    
                    <SubmitActions 
                        disabledButtons={loading} 
                        handleSave={() => triggerValidation().then( isValid => {
                            isValid && onSubmit(getValues(), null)}
                        ) }/>
       </DefaultForm>
    );
}

export default Form;