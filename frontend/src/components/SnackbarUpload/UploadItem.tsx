// @flow 
import * as React from 'react';
import { ListItem, ListItemIcon, ListItemText, Typography, Divider, makeStyles, Theme, Tooltip } from '@material-ui/core';
import MovieIcon from '@material-ui/icons/Movie';
const useStyles = makeStyles((theme: Theme) => ({
    listItem: {
        paddingTop: '7px',
        paddingBottom: '7px',
        height: '53px'
    },
    listItemText: {
        marginLeft: '6px',
        marginRight: '24px',
        color: theme.palette.text.secondary
    },
    movieIcon: {
        color: theme.palette.error.main,
        minWidth: '40px'
    }

}))
interface UploadItemProps {

}
export const UploadItem: React.FC<UploadItemProps> = (props) => {
    const classes = useStyles();
    return (
        <>
            <Tooltip 
                title={"Não foi possível fazer o upload, clique para mais detalhes"}
                placement={"left"}
                >
                <ListItem className={classes.listItem}>
                    <ListItemIcon className={classes.movieIcon}>
                        <MovieIcon />
                    </ListItemIcon>
                    <ListItemText
                        className={classes.listItemText}
                        primary={
                            <Typography noWrap={true} variant={'subtitle2'} color={"inherit"}>
                                E o Vento Levou
                        </Typography>
                        }
                    >

                    </ListItemText>
                </ListItem>
            </Tooltip>
            <Divider></Divider>
        </>
    );
};