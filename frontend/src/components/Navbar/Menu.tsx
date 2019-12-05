import * as React from 'react';
import {makeStyles, Theme, IconButton, Menu as MuiMenu, MenuItem } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import routes, { MyRouteProps } from '../../routes';
import { Link } from 'react-router-dom';

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
const listRoutes = {
    'dashboard':'Dashboard',
    'categories.list':"Categorias",
    'cast_members.list':"Membros de elenco",
    'genres.list': "Gêneros"
};

export const Menu: React.FC = ()=>{
    
    const menuRoutes = routes.filter(route => Object.keys(listRoutes).includes(route.name));
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
                    {
                        Object.keys(listRoutes).map((routeName,key) => {
                                const route = menuRoutes.find(route => route.name === routeName) as MyRouteProps;
                                return ( <MenuItem key={key}
                                            onClick={handleClose} component={Link} to={route.path as string}>
                                            {listRoutes[routeName]}
                                        </MenuItem>
                                )

                            }
                            
                            
                            )
                    }
                    
                    
                </MuiMenu>

        </React.Fragment>
                
    )
}