
import * as React from 'react';
import {useState,useEffect} from 'react';
import {Autocomplete, AutocompleteProps} from '@material-ui/lab';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { CircularProgress } from '@material-ui/core';
import { useSnackbar } from 'notistack';

interface AsyncAutoCompleteProps{
    TextFieldProps?: TextFieldProps;
    fetchOptions: (searchText) => Promise<any>;
    AutocompleteProps?: Omit<AutocompleteProps<any>,'renderInput'>;

}

const AsyncAutoComplete:React.FC<AsyncAutoCompleteProps> = (props) => {
    const {AutocompleteProps} = props;
    const {freeSolo, onOpen, onClose, onInputChange} = AutocompleteProps as any;
    const [open, setOpen] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const snackbar = useSnackbar();
    const textFieldProps: TextFieldProps = {
        margin:"normal",
        variant:"outlined",
        fullWidth:true,
        InputLabelProps:{shrink:true},
        ...(props.TextFieldProps && {...props.TextFieldProps})

    }

    const autocompleteProps: AutocompleteProps<any> = {
        loadingText: 'Carregando...',
        noOptionsText: "Nenhum item encontrado",
        ...(AutocompleteProps && {...AutocompleteProps}),
        open,
        loading,
        options,
        onOpen(){
            setOpen(true);
            onOpen && onOpen();
        },
        onClose(){
            setOpen(false);
            onClose && onClose();
        },
        onInputChange(event, value){
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
                    endAdornment:(
                        <>
                            {loading && <CircularProgress color={"inherit"} size={20}/>}
                            {params.InputProps.endAdornment}
                        </>
                    )
                }}
            />
            }
            
        
    }
    useEffect(() => {
        if(!open && !freeSolo){
            setOptions([]);
        }
        
    }, [open]);
    useEffect(() => {
        if(!open || searchText ==="" && freeSolo){
            return;
        }
        let isSubscribed = true;

        (async function getCategory(){
            setLoading(true);
            try {
                
                const data = await props.fetchOptions(searchText);
                if(isSubscribed){
                    setOptions(data);
                }
                
                
            } finally{
                setLoading(false);
            }

        })();
        return ()=>{
            let isSubscribed = false;
        }
        
    }, [freeSolo ? searchText: open]);

    return (
        <div>
            <Autocomplete {...autocompleteProps}/>
        </div>
    );
};

export default AsyncAutoComplete;