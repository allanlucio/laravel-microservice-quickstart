// @flow 
import * as React from 'react';
import { Card, CardActions, Typography, IconButton, Collapse, List, Theme, makeStyles } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CloseIcon from '@material-ui/icons/Close';
import { useSnackbar } from 'notistack';
import classnames from 'classnames';
import { UploadItem } from './UploadItem';
const useStyles = makeStyles((theme: Theme)=>({
    card: {
        width: 450
    },
    cardActionRoot:{
        padding: '8px 8px 8px 16px',
        backgroundColor: theme.palette.primary.main
    },
    title:{
        fontWeight: 'bold',
        color: theme.palette.primary.contrastText
    },
    icons:{
        marginLeft:'auto !important',
        color: theme.palette.primary.contrastText
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform',{
            duration: theme.transitions.duration.shortest
        })
    },
    expandOpen: {
        transform: 'rotate(180deg)',
        transition: theme.transitions.create('transform',{
            duration: theme.transitions.duration.shortest
        })
    },
    list:{
        paddingTop:0,
        paddingBottom:0
    }
}))

interface SnackbarUploadProps {
    id: string | any;
}
export const SnackbarUpload = React.forwardRef<any, SnackbarUploadProps>((props,ref) => {
    const classes = useStyles();
    const {id} = props;
    const {closeSnackbar} = useSnackbar();
    const [expanded, setExpanded] = React.useState(true);
    return (
        <Card ref={ref} className={classes.card}>
            <CardActions classes={{root:classes.cardActionRoot}}>
                <Typography className={classes.title}>
                    Fazendo upload de 10 videos
                </Typography>
                <div className={classes.icons}>
                    <IconButton color={"inherit"}
                        className={
                            classnames(classes.expand, {[classes.expandOpen]: !expanded})
                        }
                        onClick={()=>setExpanded(!expanded)}
                        >
                        <ExpandMoreIcon/>
                    </IconButton>
                    <IconButton 
                        onClick={
                            ()=>closeSnackbar(id)
                        }
                        color={"inherit"}>
                        <CloseIcon/>
                    </IconButton>
                </div>
            </CardActions>
            <Collapse in={expanded}>
                <List className={classes.list}>
                    <UploadItem/>
                    <UploadItem/>
                </List>
            </Collapse>
        </Card>
    );
});