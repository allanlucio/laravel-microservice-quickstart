// @flow 
import * as React from 'react';
import {useRef} from 'react';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, FormHelperText, Box, Button } from '@material-ui/core';
import { FormControlLabelProps } from '@material-ui/core/FormControlLabel';
import { Rating } from '../../../components/Rating';
import { FormControlProps } from '@material-ui/core/FormControl';
import InputFile, { InputFileComponent } from '../../../components/inputFile';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

interface UploadFieldProps {
    accept:string;
    label: string;
    setValue: (value) => void;
    disabled?: boolean;
    error?: any;
    FormControlProps?: FormControlProps


    
};

export const UploadField: React.FC<UploadFieldProps> = (props) => {
    const fileRef = useRef() as React.MutableRefObject<InputFileComponent>
    const {label,accept, setValue, disabled, error} = props;

    return (
        <FormControl 
            
            disabled={disabled === true} 
            error={error!== undefined}
            fullWidth
            margin={"normal"}
            {...props.FormControlProps}
        >
            
            <InputFile 
                    ref={fileRef}
                    TextFieldProps={{
                        label: label,
                        InputLabelProps: {shrink:true},
                        style: {backgroundColor: '#ffffff'}
                    }}
                    InputFileProps={{
                        accept,
                        onChange(event){
                            const files = event.target.files as any;
                            files.length && setValue(files[0]);
                        }
                    }}
                    ButtonFile={
                        <Button 
                        endIcon={<CloudUploadIcon/>}
                        variant={'contained'}
                        color={'primary'}
                        onClick= {() => fileRef.current.openWindow()}
                        
                        >
                            Adicionar
                        </Button>
                    }/>
            
            

            {
                error && <FormHelperText >{error.message}</FormHelperText>
            }
            
        </FormControl>
    );
};