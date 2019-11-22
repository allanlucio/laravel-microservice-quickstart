import * as React from 'react';
import { AppBar, Toolbar, makeStyles, Typography, Button, Theme } from '@material-ui/core';
import logo from "../../static/img/logo.jpg";
import {Menu} from "./Menu";


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

export const Navbar: React.FC = ()=>{
    const classes = useStyles();
    const[anchorEl,setAnchorEl]=React.useState(null);
    const open = Boolean(anchorEl);
    const handleOpen = (event:any) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    return (
        <AppBar>
            <Toolbar className={classes.toolbar}>
                <Menu/>
                <Typography className={classes.title}>
                    <img className={classes.logo} src={logo} alt=""/>
                </Typography>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    )
}