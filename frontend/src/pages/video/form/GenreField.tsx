// @flow 
import * as React from 'react';
import AsyncAutoComplete, { AsyncAutoCompleteComponent } from '../../../components/AsyncAutoComplete';
import { GridSelected } from '../../../components/GridSelected';
import GridSelectedItem from '../../../components/GridSelectedItem';
import { Typography, FormControl, FormControlProps, FormHelperText } from '@material-ui/core';
import useHttpHandled from '../../../hooks/useHttpHandled';
import genreHttp from '../../../util/http/genre-http';
import useCollectionManager from '../../../hooks/useCollectionManager';
import { getGenresFromCategory } from '../../../util/model-filters';
import { useImperativeHandle, useRef } from 'react';
interface GenreFieldProps extends React.RefAttributes<GenreFieldComponent>{
    genres: any[];
    disabled?: boolean;
    error: any;
    setGenres: (genres) => void;
    FormControlProps?: FormControlProps;
    categories: any[];
    setCategories: (categories) => void;

};

export interface GenreFieldComponent {
    clear: () => void;
}
const GenreField= React.forwardRef<GenreFieldComponent,GenreFieldProps>((props,ref) => {
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
    const autocompleteRef = useRef() as React.MutableRefObject<AsyncAutoCompleteComponent>;
    
    useImperativeHandle(ref, ()=> ({
        clear: () => autocompleteRef.current.clear()
    }));
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
                ref={autocompleteRef}
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
});

export default GenreField;