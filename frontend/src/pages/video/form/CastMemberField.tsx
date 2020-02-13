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

interface CastMemberFieldProps {
    castMembers: any[];
    setCastMemebers: (castMember) => void;
    disabled?: boolean;
    error: any;
    FormControlProps?: FormControlProps

};
const CastMemberField: React.FC<CastMemberFieldProps> = (props) => {
    const { castMembers, setCastMemebers, disabled, error } = props;
    const autocompleteHttp = useHttpHandled();
    const { addItem, removeItem } = useCollectionManager(castMembers, setCastMemebers);

    function fetchOptions(searchText) {
        return autocompleteHttp(
            categoryHttp.list(
                {
                    queryParams:
                    {
                        search: searchText,
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
                    freeSolo: true,
                    getOptionLabel: option => option.name,
                    getOptionSelected: (option, value) => option.id === value.id,
                    onChange: (event, value) => addItem(value),
                    disabled
                }}
                TextFieldProps={{
                    label: 'Memebros de elenco',
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
                    {castMembers.map((castMember, key) => {
                        return (<GridSelectedItem key={key} onDelete={() => { removeItem(castMember) }} xs={12}>
                            <Typography noWrap={true}>{castMember.name}</Typography>
                            
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

export default CastMemberField;