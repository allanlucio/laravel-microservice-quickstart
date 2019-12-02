import * as React from 'react';
import { Page } from '../../components/Page';
import { Box } from '@material-ui/core';
import {Form} from "./Form";

const PageForm: React.FC = ()=>{
    
    return (
        <Page title = {'Criar gênero'}>
            
            <Box>
                <Form/>
            </Box>
        </Page>
    );
}

export default PageForm;