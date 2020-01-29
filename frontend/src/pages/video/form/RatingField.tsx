// @flow 
import * as React from 'react';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, FormHelperText, Box } from '@material-ui/core';
import { FormControlLabelProps } from '@material-ui/core/FormControlLabel';
import { Rating } from '../../../components/Rating';
import { FormControlProps } from '@material-ui/core/FormControl';

interface RatingFieldProps {
    value: string;
    setValue: (value) => void;
    disabled?: boolean;
    error: any;
    FormControlProps?: FormControlProps


    
};

const ratings: FormControlLabelProps[]=[
    {value: "L", control:<Radio color="primary"/>, label:<Rating rating={"L"}/>, labelPlacement:"top"},
    {value: "10", control:<Radio color="primary"/>, label:<Rating rating={"10"}/>, labelPlacement:"top"},
    {value: "12", control:<Radio color="primary"/>, label:<Rating rating={"12"}/>, labelPlacement:"top"},
    {value: "14", control:<Radio color="primary"/>, label:<Rating rating={"14"}/>, labelPlacement:"top"},
    {value: "16", control:<Radio color="primary"/>, label:<Rating rating={"16"}/>, labelPlacement:"top"},
    {value: "18", control:<Radio color="primary"/>, label:<Rating rating={"18"}/>, labelPlacement:"top"},
    
];
export const RatingField: React.FC<RatingFieldProps> = (props) => {
    const {value, setValue, disabled, error} = props;
    return (
        <FormControl 
            
            disabled={disabled === true} 
            error={error!== undefined}
            {...props.FormControlProps}
        >
            <FormLabel component="legend">Classificação</FormLabel>
            <Box padding={1} >
                <RadioGroup 
                    value={value} 
                    aria-label="gender" 
                    name="rating" 
                    row
                    onChange={ (e) =>{
                        setValue(e.target.value)
                    }}
                >
                {
                    ratings.map(
                        (ratingProps,key)=> <FormControlLabel key={key} {...ratingProps}/>
                    )
                }
                
                </RadioGroup>
            </Box>
            
            

            {
                error && <FormHelperText >{error.message}</FormHelperText>
            }
            
        </FormControl>
    );
};