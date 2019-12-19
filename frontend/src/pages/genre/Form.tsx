import * as React from 'react';
import {useEffect, useState} from "react";
import { TextField, Box, Button, makeStyles, Theme, FormLabel, RadioGroup, FormControlLabel, Radio, FormControl, Checkbox, InputLabel, Select, MenuItem, Input, Chip, useTheme, FormHelperText } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import useForm from "react-hook-form";
import genreHttp from '../../util/http/genre-http';
import * as yup from '../../util/vendor/yup';
import { useParams, useHistory } from 'react-router';
import {useSnackbar} from "notistack"
import categoryHttp from '../../util/http/category-http';
import { Genre, Category, ListResponse } from '../../util/models';

const useStyles = makeStyles((theme:Theme)=> {
    return {
        submit: {
            margin: theme.spacing(1)
        },
        formControl: {
            margin: theme.spacing(1),
        },
        chips: {
            display: 'flex',
            flexWrap: 'wrap',
          },
        chip: {
            margin: 2,
        },
    }
})

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


function getStyles(name, categories_id, theme) {
    return {
      fontWeight:
      categories_id.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
     
    };
  }

const validationSchema = yup.object().shape({
    name: yup
            .string()
            .label("Nome")
            .required()
            .max(255),
    categories_id: yup
            .array()
            .label("Categorias")
            .required()
});

export const Form: React.FC = ()=>{
    const classes = useStyles();
    const theme = useTheme();

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
            categories_id : [],
            is_active: true
        }
        
    });
    const snackbar = useSnackbar();
    const history = useHistory();
    const {id} = useParams();
    const [genre, setGenre] = useState<Genre | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    
    const buttonProps: ButtonProps ={
        variant: 'contained',
        color: 'secondary',
        className: classes.submit,
        disabled: loading
        
    }
    const [categoriesList, setCategoriesList] = useState<Category[]>([]);
    const categoriesValue = watch('categories_id');
    useEffect(() => {
        categoryHttp.list().then(response => {
            setCategoriesList(response.data.data);
        });
        
      }, []);
    
    useEffect(() => {
        register({ name: 'categories_id'});  
        register({ name: 'is_active'});  
    }, [register])
    
    
    useEffect(() => {
        let isSubscribed = true;
        (async () => {
            setLoading(true)
            const promises = [categoryHttp.list()];
            if(id){
                promises.push(genreHttp.get(id));
            }

            try {
                const [categoriesResponse, genreResponse] = await Promise.all(promises);
                if(isSubscribed){
                    setCategoriesList(categoriesResponse.data.data);
                    if(id){
                        setGenre(genreResponse.data.data);
                        let data = genreResponse.data.data;
                        const categories = data.categories.map((category) => category.id);
                        data["categories_id"] = categories;
                        reset(data);
                    }
                }
            }catch(error){
                console.log(error);
                snackbar.enqueueSnackbar("Não foi possível carregar as informações",{variant: 'error'});
            }finally{
                setLoading(false)
            }
        })();

        return () => {
            isSubscribed = false;
        }
        // if(!id){
        //     return ;
        // }
        // setTimeout(()=>{
        //     genreHttp.get(id).then(({data}) => {
        //         setGenre(data.data)
        //         console.log(data.data);
        //         let data_reset = data.data;
        //         const categories = data_reset.categories.map((category) => category.id);
        //         data_reset["categories_id"] = categories;
        //         reset(data_reset);
        //     }).finally(()=> setLoading(false));
        // },200)
        
    }, [])


    function onSubmit(formData, event){
        setLoading(true);
        
        const http = genre ? 
            genreHttp.update(genre.id,formData):
            genreHttp.create(formData);

        http.then(({data})=> {
            snackbar.enqueueSnackbar('Gênero Salva com Sucesso!',{
                variant: 'success',
            })
            setTimeout(()=>{
                event ? (
                    id? history.replace(`/genres/${data.data.id}/edit`): history.push(`/genres/${data.data.id}/edit`)
                ): history.push('/genres')
            },100)
            

        })
        .catch((error)=> {
            
            snackbar.enqueueSnackbar('Não foi possível salvar esta categoria',{
                variant: 'error',
            })
        })
        .finally(()=>setLoading(false));
    }
    const handleFormChange = event => {
        console.log(event.target.value);
        
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

            <FormControl 
                className={classes.formControl} 
                fullWidth 
                disabled={loading}
                error={errors.categories_id !== undefined}
                
            >
            <InputLabel id="demo-mutiple-chip-label">Categorias</InputLabel>
                <Select
                
                labelId="demo-mutiple-chip-label"
                id="demo-mutiple-chip"
                multiple
                value={categoriesValue}
                onChange={handleFormChange}
                input={<Input id="select-multiple-chip" />}
                name="categories_id"
                renderValue={(selected:any) => {

                    return <div className={classes.chips}>
                    {selected.map(value => {
                        const category = categoriesList.find(category => category.id===value);
                        return <Chip key={value} label={category!.name} className={classes.chip} />;
                        }
                    )}
                    </div>;
                }
                    
                    
                }
                MenuProps={MenuProps}
                >
                {categoriesList.map(category => (
                    <MenuItem key={category.id} value={category.id} style={getStyles(category.name, categoriesValue, theme)}>
                    {category.name} 
                    </MenuItem>
                ))}
                </Select>
                <FormHelperText>{errors.categories_id && errors.categories_id.message}</FormHelperText>
        </FormControl>
      
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
                <Button {... buttonProps} onClick={() => onSubmit(getValues(), null)}> Salvar</Button>
                <Button {... buttonProps} type="submit"> Salvar e continuar editando</Button>
                
            </Box>

        </form>
    );
}

export default Form;