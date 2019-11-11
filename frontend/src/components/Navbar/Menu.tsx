import * as React from 'react';
import {makeStyles, Theme, IconButton, Menu as MuiMenu, MenuItem } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme: Theme) =>({
    toolbar:{
        backgroundColor: '#000000'
    },
    title:{
        flexGrow: 1,
        textAlign: 'center'
    },
    logo:{
        width:80,
        [theme.breakpoints.up('sm')]: {
            width: 100
        }
    }
}));

export const Menu: React.FC = ()=>{
    const classes = useStyles();
    const[anchorEl,setAnchorEl]=React.useState(null);
    const open = Boolean(anchorEl);
    const handleOpen = (event:any) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    return (
            <React.Fragment>
                <IconButton
                    color="inherit"
                    edge="start"
                    aria-label="open drawer"
                    aria-controls="menu-appbar"
                    aria-haspopup='true'
                    onClick={handleOpen}
                    >
                    <MenuIcon/>
                </IconButton>
                <MuiMenu 
                    id="menu-appbar" 
                    open={open} 
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{vertical:'bottom', horizontal:'center'}}
                    transformOrigin={{vertical:'top', horizontal:'center'}}
                    >
                    <MenuItem
                        onClick={handleClose}
                        >Categorias</MenuItem>
                </MuiMenu>

        </React.Fragment>
                
    )
}