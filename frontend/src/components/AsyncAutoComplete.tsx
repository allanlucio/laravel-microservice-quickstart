
import * as React from 'react';
import { useState, useEffect, useImperativeHandle } from 'react';
import { Autocomplete, AutocompleteProps, UseAutocompleteSingleProps } from '@material-ui/lab';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { CircularProgress } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { useDebounce } from 'use-debounce/lib';

interface AsyncAutoCompleteProps extends React.RefAttributes<AsyncAutoCompleteComponent> {
    TextFieldProps?: TextFieldProps;
    debounceTime?: number;
    fetchOptions: (searchText) => Promise<any>;
    AutocompleteProps?: Omit<AutocompleteProps<any>, 'renderInput'> & UseAutocompleteSingleProps<any>;

}
export interface AsyncAutoCompleteComponent {
    clear: () => void
}

const AsyncAutoComplete= React.forwardRef<AsyncAutoCompleteComponent,AsyncAutoCompleteProps>((props,ref) => {
    const { AutocompleteProps, debounceTime = 300 } = props;
    const { freeSolo, onOpen, onClose, onInputChange } = AutocompleteProps as any;
    const [open, setOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [debouncedSearchTex] = useDebounce(searchText, debounceTime);
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const snackbar = useSnackbar();
    const textFieldProps: TextFieldProps = {
        margin: "normal",
        variant: "outlined",
        fullWidth: true,
        InputLabelProps: { shrink: true },
        ...(props.TextFieldProps && { ...props.TextFieldProps })

    }

    const autocompleteProps: AutocompleteProps<any> = {
        loadingText: 'Carregando...',
        noOptionsText: "Nenhum item encontrado",
        ...(AutocompleteProps && { ...AutocompleteProps }),
        open,
        loading,
        options,
        inputValue:searchText,
        onOpen() {
            setOpen(true);
            onOpen && onOpen();
        },
        onClose() {
            setOpen(false);
            onClose && onClose();
        },
        onInputChange(event, value) {
            setSearchText(value);
            onInputChange && onInputChange(event, value);
        },
        renderInput:
            params => {
                return <TextField
                    {...params}
                    {...textFieldProps}
                    
                    InputProps={{
                        ...params.InputProps,
                        
                        endAdornment: (
                            <>
                                {loading && <CircularProgress color={"inherit"} size={20} />}
                                {params.InputProps.endAdornment}
                            </>
                        )
                    }}
                />
            }


    }
    useEffect(() => {
        if (!open && !freeSolo) {
            setOptions([]);
        }

    }, [open]);
    useEffect(() => {
        if (!open || debouncedSearchTex === "" && freeSolo) {
            return;
        }
        let isSubscribed = true;

        (async function getCategory() {
            setLoading(true);
            try {

                const data = await props.fetchOptions(debouncedSearchTex);
                if (isSubscribed) {
                    setOptions(data);
                }


            } finally {
                setLoading(false);
            }

        })();
        return () => {
            let isSubscribed = false;
        }

    }, [freeSolo ? debouncedSearchTex : open]);

    useImperativeHandle(ref, ()=> ({
        clear: () => {
            
            setSearchText("");
            setOptions([]);
        }
    }));

    return (
        <div>
            <Autocomplete {...autocompleteProps} />
        </div>
    );
});

export default AsyncAutoComplete;