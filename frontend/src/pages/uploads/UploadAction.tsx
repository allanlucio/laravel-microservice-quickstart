// @flow 
import * as React from 'react';
import { ListItem, ListItemIcon, ListItemText, Typography, Divider, makeStyles, Theme, Tooltip, Grid, Fade, IconButton } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';


import { UploadProgress } from '../../components/UploadProgress';
import { Link } from 'react-router-dom';
const useStyles = makeStyles((theme: Theme) => ({
    successIcon:{
        color:theme.palette.success.main,
        marginLeft:theme.spacing(1)
    },
    errorIcon:{
        color:theme.palette.error.main,
        marginLeft:theme.spacing(1)
    },
    divider:{
        height:'20px',
        marginLeft:theme.spacing(1),
        marginRight:theme.spacing(1)
    },

}))
interface UploadActionProps {

}
export const UploadAction: React.FC<UploadActionProps> = (props) => {
    const classes = useStyles();
    
    return (
        <Fade in={true} timeout={{enter: 1000}}>
            <>
                <CheckCircleIcon className={classes.successIcon}/>
                <ErrorIcon className={classes.errorIcon}/>
                <>
                    <Divider className={classes.divider} orientation={'vertical'}/>
                    <IconButton>
                        <DeleteIcon color={'primary'}/>
                    </IconButton>
                    <IconButton
                        component={Link}
                        to={'/videos/uuid/edit'}
                    >
                        <EditIcon color={'primary'}/>
                    </IconButton>
                </>
                
            </>
        </Fade>
    );
};