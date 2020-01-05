// @flow 
import * as React from 'react';
import { Tooltip, IconButton, makeStyles } from '@material-ui/core';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import classes from '*.module.sass';

const useStyles = makeStyles( theme => ({
    iconButton: (theme as any).overrides.MUIDataTableToolbar.icon
}));

interface filterResetButtonProps{
    handleClick: () => void;
}

export const FilterResetButton: React.FC<filterResetButtonProps> = (props) => {
    const classes = useStyles();
    return (
        <Tooltip title={"Limpar Busca"}>
            <IconButton className={classes.iconButton} onClick={props.handleClick}>
                <ClearAllIcon  />
            </IconButton>
        </Tooltip>
    );
};