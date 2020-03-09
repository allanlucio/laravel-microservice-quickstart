// @flow 
import * as React from 'react';
import { ListItem, ListItemIcon, ListItemText, Typography, Divider, makeStyles, Theme, Tooltip, CircularProgress, Fade } from '@material-ui/core';
import MovieIcon from '@material-ui/icons/Movie';
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles((theme: Theme) => ({
    progressContainer: {
        position: 'relative'
    },
    progress: {
        position: "absolute",
        left: 0
    },
    progressBackground: {
        color: grey[400]
    }

}))
interface UploadProgressProps {
    size: number;
}
export const UploadProgress: React.FC<UploadProgressProps> = (props) => {
    const { size } = props;
    const classes = useStyles();
    return (
        <Fade in={true} timeout={{
            enter:100, exit:2000
        }}>
            <div className={classes.progressContainer}>
                <CircularProgress
                    variant="static"
                    value={100}
                    className={classes.progressBackground}
                    size={size}
                />
                <CircularProgress
                    variant="static"
                    className={classes.progress}
                    size={size}
                />
            </div>
        </Fade>
    );
};