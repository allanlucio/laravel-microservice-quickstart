import * as React from 'react';
import {useEffect, useState} from "react";
import { TextField, makeStyles, Theme, FormControlLabel, FormControl, Checkbox, InputLabel, Select, MenuItem, Input, Chip, useTheme, FormHelperText, Grid, Typography, useMediaQuery } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import useForm from "react-hook-form";
import videoHttp from '../../../util/http/video-http';
import * as yup from '../../../util/vendor/yup';
import { useParams, useHistory } from 'react-router';
import {useSnackbar} from "notistack"
import categoryHttp from '../../../util/http/category-http';
import { Video, Category, ListResponse } from '../../../util/models';
import SubmitActions from '../../../components/SubmitActions';
import { min } from 'date-fns/esm';
import { DefaultForm } from '../../../components/DefaultForm';
import { Rating } from '../../../components/Rating';
import { RatingField } from './RatingField';

const validationSchema = yup.object().shape({
    title: yup
            .string()
            .label("Titulo")
            .required()
            .max(255),
    description: yup
            .string()
            .label("Sinopse")
            .min(1)
            .required(),
    year_launched: yup
            .number()
            .label("Ano de Lançamento")
            .required(),
    duration: yup
            .number()
            .label("Duraçao")
            .min(1)
            .required(),
    rating: yup
            .string()
            .label("Classificaçao")
            .required(),
    
});

const useStyles = makeStyles((theme:Theme)=> {
    return {
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



export const Form: React.FC = ()=>{
    const classes = useStyles();
    const theme = useTheme();

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
            
        }
        
    });
    const snackbar = useSnackbar();
    const history = useHistory();
    const {id} = useParams();
    const [video, setVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const isGreaterMd = useMediaQuery(theme.breakpoints.up('md'))
    
    // const [categoriesList, setCategoriesList] = useState<Category[]>([]);
    // const categoriesValue = watch('categories_id');
    // useEffect(() => {
    //     categoryHttp.list().then(response => {
    //         setCategoriesList(response.data.data);
    //     });
        
    //   }, []);
    
    useEffect(() => {
        register({ name: 'rating'});  
        register({ name: 'opened'});  
    }, [register])
    
    
    useEffect(() => {
        if(!id){
            return;
        }
        let isSubscribed = true;
        (async () => {
            setLoading(true)
            try {
                const {data} = await videoHttp.get(id);
                if(isSubscribed){
                    setVideo(data.data);
                    reset(data.data);
                    
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
        
    }, [])


    function onSubmit(formData, event){
        setLoading(true);
        
        const http = video ? 
            videoHttp.update(video.id,formData):
            videoHttp.create(formData);

        http.then(({data})=> {
            snackbar.enqueueSnackbar('Video Salvo com Sucesso!',{
                variant: 'success',
            })
            setTimeout(()=>{
                event ? (
                    id? history.replace(`/videos/${data.data.id}/edit`): history.push(`/videos/${data.data.id}/edit`)
                ): history.push('/videos')
            },100)
            

        })
        .catch((error)=> {
            
            snackbar.enqueueSnackbar('Não foi possível salvar este Vídeo',{
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
        <DefaultForm 
            GridItemProps={{xs:12, md:12}}
            onSubmit={handleSubmit(onSubmit)
            }>
            
            <Grid container spacing={5}>
                <Grid item xs={12} md={6}>
                    <TextField
                    inputRef={register}
                    name='title'
                    label='titulo'
                    fullWidth
                    variant={'outlined'}
                    error={errors.title !== undefined}
                    helperText={errors.title && errors.title.message}
                    InputLabelProps={{shrink: true}}
                    disabled={loading}
                    />

                    <TextField
                    inputRef={register}
                    name='description'
                    label='Sinopse'
                    multiline
                    rows='4'
                    margin="normal"
                    fullWidth
                    variant={'outlined'}
                    error={errors.description !== undefined}
                    helperText={errors.description && errors.description.message}
                    InputLabelProps={{shrink: true}}
                    disabled={loading}
                    />
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                        <TextField
                            inputRef={register}
                            name='year_launched'
                            label='Ano de lançamento'
                            type="number"
                            margin="normal"
                            fullWidth
                            variant={'outlined'}
                            error={errors.year_launched !== undefined}
                            helperText={errors.year_launched && errors.year_launched.message}
                            InputLabelProps={{shrink: true}}
                            disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={6}>
                        <TextField
                            inputRef={register}
                            name='duration'
                            label='Duraçao'
                            type="number"
                            margin="normal"
                            fullWidth
                            variant={'outlined'}
                            error={errors.duration !== undefined}
                            helperText={errors.duration && errors.duration.message}
                            InputLabelProps={{shrink: true}}
                            disabled={loading}
                            />
                        </Grid>
                    </Grid>
                </Grid> 


                <Grid item xs={12} md={6}>
                    <RatingField 
                        value = {watch('rating')}
                        setValue = {
                            (value)=>setValue('rating', value, true)
                        }
                        error= {errors.rating}
                        disabled={loading}

                        FormControlProps={{
                            margin: isGreaterMd? 'none': 'normal'
                        }}
                    />
                <FormControlLabel
                control={
                    <Checkbox
                    
                    name="opened"
                    checked={watch("opened")}
                    onChange={()=>setValue('opened', !getValues()['opened'])}
                    color={"primary"}
                    
                />
                }
                label={
                    <Typography color="primary" variant={'subtitle2'}>
                        Quero que este conteúdo apareça na seção Lançamentos
                    </Typography>
                }
                labelPlacement="end"
                disabled={loading}
                />

                </Grid>

            </Grid>
            
        
        <SubmitActions 
                disabledButtons={loading} 
                handleSave={() => triggerValidation().then( isValid => {
                    isValid && onSubmit(getValues(), null)}
                ) }/>

        </DefaultForm>
    );
}

export default Form;