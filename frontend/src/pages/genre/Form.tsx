import * as React from 'react';
import {useEffect, useState} from "react";
import { TextField, Box, Button, makeStyles, Theme, FormLabel, RadioGroup, FormControlLabel, Radio, FormControl, Checkbox, InputLabel, Select, MenuItem, Input, Chip, useTheme } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import useForm from "react-hook-form";
import genreHttp from '../../util/http/genre-http';
import categoryHttp from '../../util/http/category-http';
import { Category } from '../../util/models/category';


const useStyles = makeStyles((theme:Theme)=> {
    return {
        submit: {
            margin: theme.spacing(1)
        },
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

export const Form: React.FC = ()=>{
    const classes = useStyles();
    const theme = useTheme();
    const buttonProps: ButtonProps ={
        variant: 'contained',
        color: 'secondary',
        className: classes.submit
        
    }
    const {register, handleSubmit, getValues, setValue, watch} = useForm({
        defaultValues: {
            type: 0,
            categories_id : [],
        }
    })
    const [categoriesList, setCategoriesList] = useState<Category[]>([]);
    const categoriesValue = watch('categories_id');
    useEffect(() => {
        categoryHttp.list().then(response => {
            setCategoriesList(response.data.data);
        });
        
      }, []);
    
    useEffect(() => {
        register({ name: 'categories_id'});  
    }, [register])
    
    function onSubmit(formData, event){
        
        genreHttp.create(formData).then((response)=> console.log(response));
    }
    const handleFormChange = event => {
        
        setValue(event.target.name, event.target.value, true);
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                inputRef={register}
                name='name'
                label='Nome'
                fullWidth
                variant={'outlined'}
            />

            <FormControl className={classes.formControl} fullWidth>
            <InputLabel id="demo-mutiple-chip-label">Categorias</InputLabel>
                <Select
                
                labelId="demo-mutiple-chip-label"
                id="demo-mutiple-chip"
                multiple
                value={categoriesValue}
                onChange={handleFormChange}
                input={<Input id="select-multiple-chip" />}
                name="categories_id"
                renderValue={(selected:any) => {

                    return <div className={classes.chips}>
                    {selected.map(value => {
                        const category = categoriesList.find(category => category.id===value);
                        return <Chip key={value} label={category!.name} className={classes.chip} />;
                        }
                    )}
                    </div>;
                }
                    
                    
                }
                MenuProps={MenuProps}
                >
                {categoriesList.map(category => (
                    <MenuItem key={category.id} value={category.id} style={getStyles(category.name, categoriesValue, theme)}>
                    {category.name} 
                    </MenuItem>
                ))}
                </Select>
        </FormControl>
      
        <Checkbox
                
                inputRef={register}
                name="is_active"
                defaultChecked
            />Ativo?
        

            <Box dir={"rtl"}>
                <Button {... buttonProps} onClick={() => onSubmit(getValues(), null)}> Salvar</Button>
                <Button {... buttonProps} type="submit"> Salvar e continuar editando</Button>
                
            </Box>

        </form>
    );
}

export default Form;