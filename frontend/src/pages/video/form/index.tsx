import { Card, CardContent, Checkbox, FormControlLabel, FormHelperText, Grid, makeStyles, TextField, Theme, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import { omit, zipObject } from "lodash";
import { useSnackbar } from "notistack";
import * as React from 'react';
import { useEffect, useState } from "react";
import useForm from "react-hook-form";
import { useHistory, useParams } from 'react-router';
import { DefaultForm } from '../../../components/DefaultForm';
import { InputFileComponent } from '../../../components/inputFile';
import SubmitActions from '../../../components/SubmitActions';
import useSnackbarFormError from '../../../hooks/useSnackbarFormError';
import FormDataHelper from '../../../util/form-data-helpers';
import videoHttp from '../../../util/http/video-http';
import { genresHasAtLeastOneCategory } from '../../../util/model-filters';
import { Video, VideoFileFieldsMap } from '../../../util/models';
import * as yup from '../../../util/vendor/yup';
import CastMemberField, { CastMemberFieldComponent } from './CastMemberField';
import CategoryField, { CategoryFieldComponent } from './CategoryField';
import GenreField, { GenreFieldComponent } from './GenreField';
import { RatingField } from './RatingField';
import { UploadField } from './UploadField';

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
    categories_id: yup.array()
        .label("Categorias")
        .required()
        .test('genresHasCategory', "Cada gênero precisa ter ao menos uma categoria selecionada.", function (categories) {
            const genres = this.parent.genres_id;
            const genresHasCategories = genresHasAtLeastOneCategory(genres, categories);
            return genresHasCategories.length === genres.length;
        })
    ,
    genres_id: yup.array()
        .label("Gêneros")
        .required()

    // .transform((array) => {
    //     console.log("transform");
    //     const result = array.map((elemento) => elemento.id)

    //     return result;
    // })
    ,

    cast_members_id: yup.array()
        .label("Membros de elenco")
        .required()
        .transform((array) => {
            const result = array.map((elemento) => elemento.id)
            return result;
        })

});

const fileFields = Object.keys(VideoFileFieldsMap);
const useStyles = makeStyles((theme: Theme) => {
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
        cardUpload: {
            borderRadius: '4px',
            backgroundColor: "#f5f5f5",
            margin: theme.spacing(2, 0)
        }
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



export const Form: React.FC = () => {
    const classes = useStyles();
    const theme = useTheme();

    const { register,
        handleSubmit,
        getValues,
        setValue,
        errors,
        reset,
        watch,
        triggerValidation,
        formState
    } = useForm({
        validationSchema,
        defaultValues: {
            genres_id: [],
            categories_id: [],
            cast_members_id: [],
            rating: "L",
            opened: false
        }

    });

    useSnackbarFormError(formState.submitCount, errors);

    const snackbar = useSnackbar();
    const history = useHistory();
    const { id } = useParams();
    const [video, setVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const isGreaterMd = useMediaQuery(theme.breakpoints.up('md'))
    const castMemberRef = React.useRef() as React.MutableRefObject<CastMemberFieldComponent>
    const categoryRef = React.useRef() as React.MutableRefObject<CategoryFieldComponent>
    const genreRef = React.useRef() as React.MutableRefObject<GenreFieldComponent>
    const uploadsRef = React.useRef(
        zipObject(fileFields, fileFields.map(() => React.createRef()))
    ) as React.MutableRefObject<{ [key: string]: React.MutableRefObject<InputFileComponent> }>

    console.log(uploadsRef);

    useEffect(() => {
        ["rating",
            "opened",
            "genres_id",
            "categories_id",
            "cast_members_id",
            ...fileFields
        ].forEach(name => register({ name }));
    }, [register])


    useEffect(() => {
        if (!id) {
            return;
        }
        let isSubscribed = true;
        (async () => {
            setLoading(true)
            try {
                const { data } = await videoHttp.get(id);
                if (isSubscribed) {
                    setVideo(data.data);
                    const formData = data.data;
                    formData.categories_id = formData.categories;
                    formData.genres_id = formData.genres;
                    formData.cast_members_id = formData.cast_members;
                    reset(omit(formData, fileFields));

                }
            } catch (error) {
                console.log(error);
                snackbar.enqueueSnackbar("Não foi possível carregar as informações", { variant: 'error' });
            } finally {
                setLoading(false)
            }
        })();

        return () => {
            isSubscribed = false;
        }

    }, [])


    function onSubmit(formData, event) {
        setLoading(true);

        formData.categories_id = formData.categories_id.map(category => category.id);
        formData.genres_id = formData.genres_id.map(genre => genre.id);

        const formDataHelper = new FormDataHelper(formData, fileFields, video !== null);
        const fileFormData = formDataHelper.getFormData();


        const http = video ?
            videoHttp.update(video.id, { ...formData, _method: 'PUT' }, { http: { usePost: true } }) :
            videoHttp.create(formData);

        http.then(({ data }) => {
            snackbar.enqueueSnackbar('Video Salvo com Sucesso!', {
                variant: 'success',
            })
            id && resetForm(video)
            setTimeout(() => {
                event ? (
                    id ? history.replace(`/videos/${data.data.id}/edit`) : history.push(`/videos/${data.data.id}/edit`)
                ) : history.push('/videos')
            }, 100)


        })
            .catch((error) => {

                snackbar.enqueueSnackbar('Não foi possível salvar este Vídeo', {
                    variant: 'error',
                })
            })
            .finally(() => setLoading(false));
    }

    function resetForm(data) {
        Object.keys(uploadsRef.current).forEach(
            field => uploadsRef.current[field].current.clear()
        )
        castMemberRef.current.clear();
        genreRef.current.clear();
        categoryRef.current.clear();
        // reset(data);
    }
    const handleFormChange = event => {
        console.log(event.target.value);

        setValue(event.target.name, event.target.value, false);
    };

    return (


        <DefaultForm
            GridItemProps={{ xs: 12, md: 12 }}
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
                        InputLabelProps={{ shrink: true }}
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
                        InputLabelProps={{ shrink: true }}
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
                                InputLabelProps={{ shrink: true }}
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
                                InputLabelProps={{ shrink: true }}
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <GenreField
                                ref={genreRef}
                                genres={watch('genres_id')}
                                categories={watch('categories_id')}
                                setGenres={(value) => setValue('genres_id', value, true)}
                                setCategories={(value) => setValue('categories_id', value, true)}
                                error={errors.genres_id}
                                disabled={loading}

                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CategoryField
                                ref={categoryRef}
                                categories={watch('categories_id')}
                                setCategories={(value) => setValue('categories_id', value, true)}
                                genres={watch('genres_id')}
                                error={errors.categories_id}
                                disabled={loading}

                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormHelperText>
                                Escolha os gêneros
                                </FormHelperText>
                            <FormHelperText>
                                Escolha pelo menos uma categoria de cada genero
                            </FormHelperText>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <CastMemberField
                                ref={castMemberRef}
                                castMembers={watch('cast_members_id')}
                                setCastMemebers={(value) => setValue('cast_members_id', value, true)}
                                error={errors.cast_members_id}
                                disabled={loading}

                            />
                        </Grid>
                    </Grid>

                </Grid>


                <Grid item xs={12} md={6}>
                    <RatingField
                        value={watch('rating')}
                        setValue={
                            (value) => setValue('rating', value, true)
                        }
                        error={errors.rating}
                        disabled={loading}

                        FormControlProps={{
                            margin: isGreaterMd ? 'none' : 'normal'
                        }}
                    />
                    <Card className={classes.cardUpload}>
                        <CardContent>
                            <Typography color={'primary'} variant="h6">
                                Imagens
                            </Typography>
                            <UploadField
                                ref={uploadsRef.current['thumb_file']}
                                accept={'image/*'}
                                label={"Thumb"}
                                setValue={(value) => setValue('thumb_file', value)}
                                link={video && video.thumb_file_url}

                            />
                            <UploadField
                                ref={uploadsRef.current['banner_file']}
                                accept={'image/*'}
                                label={"Banner"}
                                setValue={(value) => setValue('banner_file', value)}
                                link={video && video.banner_file_url}
                            />

                        </CardContent>
                    </Card>
                    <Card className={classes.cardUpload}>
                        <CardContent>
                            <Typography color={'primary'} variant="h6">
                                Videos
                            </Typography>
                            <UploadField
                                ref={uploadsRef.current['trailer_file']}
                                accept={'video/mp4'}
                                label={"Trailer"}
                                setValue={(value) => setValue('trailer_file', value)}
                                link={video && video.trailer_file_url}
                            />
                            <UploadField
                                ref={uploadsRef.current['video_file']}
                                accept={'video/mp4'}
                                label={"Video Principal"}
                                setValue={(value) => setValue('video_file', value)}
                                link={video && video.video_file_url}
                            />
                        </CardContent>
                    </Card>

                    <FormControlLabel
                        control={
                            <Checkbox
                                value={watch("opened")}
                                checked={watch("opened")}
                                name="opened"
                                onChange={() => setValue('opened', !getValues()['opened'])}
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
                handleSave={() => triggerValidation().then(isValid => {
                    isValid && onSubmit(validationSchema.cast(getValues()), null)
                }
                )} />

        </DefaultForm>



    );
}

export default Form;