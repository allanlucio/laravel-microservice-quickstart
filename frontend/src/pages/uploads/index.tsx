// @flow 
import * as React from 'react';
import { makeStyles, Theme, Card, CardContent, ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, Grid, List, Divider } from '@material-ui/core';
import { Page } from '../../components/Page';
import {UploadItem} from './UploadItem'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
const useStyles = makeStyles((theme: Theme) => ({
    panelSummary: {
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main
    },
    expandedIcon: {
        color: theme.palette.primary.contrastText
    }

}))

const Uploads = () => {
    const classes = useStyles();
    return (
        <Page title={'Uploads'}>
            <Card elevation={5}>
                <CardContent>
                    <UploadItem>
                        Vídeo - e o vento levou
                    </UploadItem>
                    <ExpansionPanel style={{margin:0}}>
                        <ExpansionPanelSummary
                            className={classes.panelSummary}
                            expandIcon={<ExpandMoreIcon className={classes.expandedIcon}/>}
                        >
                            <Typography>Ver Detalhes</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <Grid item xs={12}>
                                <List dense={true} style={{padding:'0px'}}>
                                    <Divider/>
                                    <UploadItem>
                                        Principal - nomedoarquivo.mp4
                                    </UploadItem>
                                </List>
                            </Grid>

                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </CardContent>
            </Card>
        </Page>
    );
};

export default Uploads;