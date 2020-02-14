// @flow 
import * as React from 'react';
import {useRef,useState,useImperativeHandle} from 'react';
import { TextField, Button, InputAdornment } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { TextFieldProps } from '@material-ui/core/TextField';

export interface InputFileProps{
    ButtonFile: React.ReactNode;
    InputFileProps?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
    TextFieldProps?: TextFieldProps;
}

export interface InputFileComponent{
    openWindow: () => void;
}

const InputFile = React.forwardRef<InputFileComponent,InputFileProps>((props,ref) => {
    const fileRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const [fileName, setFileName] = useState("");
    const textFieldProps: TextFieldProps = {
        variant:'outlined',
        ...props.TextFieldProps,
        InputProps: {
                    readOnly:true,
                    ...(props.TextFieldProps && props.TextFieldProps.InputProps && {
                        ...props.TextFieldProps.InputProps
                    }),
                    endAdornment:(
                        <InputAdornment position={"end"}>
                            {props.ButtonFile}
                        </InputAdornment>
                    )
        },
        
        value: fileName

    };

    
    const InputFileProps = {
        ...props.InputFileProps,
        hidden: true,
        ref:fileRef,
        onChange(event){
            const files = event.target.files;
            if(files.length){
                setFileName(Array.from(files).map((file: any) => file.name).join(", "));
            }

            if(props.InputFileProps && props.InputFileProps.onChange){
                props.InputFileProps.onChange(event);
            }
        },
        
    }

    useImperativeHandle(
        ref,
        () => ({
            openWindow: () => fileRef.current.click()
        })
    );
    return (
        <>
            <input type="file" 
            {...InputFileProps}/>
            <TextField {...textFieldProps}/>
        </>
    );
});

export default InputFile;