// @flow 
import * as React from 'react';
import AsyncAutoComplete from '../../../components/AsyncAutoComplete';
import { GridSelected } from '../../../components/GridSelected';
import GridSelectedItem from '../../../components/GridSelectedItem';
import { Typography, FormControl, FormControlProps, FormHelperText } from '@material-ui/core';
import useHttpHandled from '../../../hooks/useHttpHandled';
import genreHttp from '../../../util/http/genre-http';
import useCollectionManager from '../../../hooks/useCollectionManager';
import { getGenresFromCategory } from '../../../util/model-filters';
interface GenreFieldProps {
    genres: any[];
    disabled?: boolean;
    error: any;
    setGenres: (genres) => void;
    FormControlProps?: FormControlProps;
    categories: any[];
    setCategories: (categories) => void;

};
const GenreField: React.FC<GenreFieldProps> = (props) => {
    const { 
        genres, 
        setGenres, 
        disabled, 
        error,
        categories,
        setCategories 
    } = props;
    const { addItem, removeItem } = useCollectionManager(genres, setGenres);
    const { removeItem: removeCategory} = useCollectionManager(categories, setCategories);
    const autocompleteHttp = useHttpHandled();

    function fetchOptions(searchText) {
        return autocompleteHttp(
            genreHttp.list(
                {
                    queryParams:
                        { search: searchText, all: "" }
                }).then((data) => data.data));
    }

    return (
        <>
            <AsyncAutoComplete
                fetchOptions={fetchOptions}
                AutocompleteProps={{
                    // autoSelect:true,
                    clearOnEscape: true,
                    freeSolo: true,
                    getOptionLabel: option => option.name,
                    getOptionSelected: (option, value) => option.id === value.id,
                    onChange: (event, value) => addItem(value),
                    disabled
                }}
                TextFieldProps={{
                    label: 'Gêneros',
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
                    {genres.map((genre, key) => (
                        <GridSelectedItem key={key}
                            onDelete={() => {
                                const categoriesWithOneGenre = categories
                                    .filter(category => {
                                        const genresFromCategory = getGenresFromCategory(genres,category);
                                        return genresFromCategory.length === 1 && genres[0].id;
                                    })
                                categoriesWithOneGenre.forEach(cat=> removeCategory(cat));
                                removeItem(genre)
                            }} xs={12}>
                            <Typography noWrap={true}>{genre.name}</Typography>
                        </GridSelectedItem>
                    ))}

                </GridSelected>
                {
                    error && <FormHelperText>{error.message}</FormHelperText>
                }
            </FormControl>
        </>
    );
};

export default GenreField;