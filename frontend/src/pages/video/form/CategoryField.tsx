// @flow 
import * as React from 'react';
import AsyncAutoComplete from '../../../components/AsyncAutoComplete';
import { GridSelected } from '../../../components/GridSelected';
import GridSelectedItem from '../../../components/GridSelectedItem';
import { Typography, FormControl, FormHelperText, FormControlProps, makeStyles, createStyles, Theme } from '@material-ui/core';
import useHttpHandled from '../../../hooks/useHttpHandled';
import categoryHttp from '../../../util/http/category-http';
import useCollectionManager from '../../../hooks/useCollectionManager';
import { Genre } from '../../../util/models';
import genreRoutes from '../../../routes/resources/genre';
import { getGenresFromCategory } from '../../../util/model-filters';
import { grey } from '@material-ui/core/colors';
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        genresSubtitle: {
            color: grey[800],
            fontSize: '0.8rem',

        }
    })

);
interface CategoryFieldProps {
    categories: any[];
    setCategories: (categories) => void;
    genres: Genre[];
    disabled?: boolean;
    error: any;
    FormControlProps?: FormControlProps

};
const CategoryField: React.FC<CategoryFieldProps> = (props) => {
    const classes = useStyles();
    const { categories, setCategories, genres, disabled, error } = props;
    const autocompleteHttp = useHttpHandled();
    const { addItem, removeItem } = useCollectionManager(categories, setCategories);

    function fetchOptions(searchText) {
        return autocompleteHttp(
            categoryHttp.list(
                {
                    queryParams:
                    {
                        genres: genres.map((genre) => genre.id).join(","),
                        all: ""
                    }
                }).then((data) => data.data));
    }

    return (
        <>
            <AsyncAutoComplete
                fetchOptions={fetchOptions}
                AutocompleteProps={{
                    clearOnEscape: true,
                    freeSolo: false,
                    getOptionLabel: option => option.name,
                    getOptionSelected: (option, value) => option.id === value.id,
                    onChange: (event, value) => addItem(value),
                    disabled: disabled === true || !genres.length
                }}
                TextFieldProps={{
                    label: 'Categorias',
                    error: error !== undefined
                }}
            />
            <FormControl
                fullWidth
                margin={'normal'}
                disabled={disabled === true}
                error={error !== undefined}
                {...props.FormControlProps}
            >
                <GridSelected>
                    {categories.map((category, key) => {
                        const categoryGenres =getGenresFromCategory(genres,category).map(genre => genre.name).join(",");
                        return (<GridSelectedItem key={key} onDelete={() => { removeItem(category) }} xs={12}>
                            <Typography noWrap={true}>{category.name}</Typography>
                            <Typography className={classes.genresSubtitle} noWrap={true}>Gêneros: {categoryGenres}</Typography>
                        </GridSelectedItem>
                    )
                })}

                </GridSelected>
                {
                    error && <FormHelperText>{error.message}</FormHelperText>
                }
            </FormControl>
        </>
    );
};

export default CategoryField;