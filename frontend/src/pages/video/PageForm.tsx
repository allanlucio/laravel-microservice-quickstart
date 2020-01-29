import * as React from 'react';
import { Page } from '../../components/Page';
import { Box } from '@material-ui/core';
import {Form} from "./form";
import { useParams } from 'react-router';

const PageForm: React.FC = ()=>{
    const {id} = useParams();

    return (
        <Page title = {id ? "Editar Video" : 'Criar de Video'}>
            
            <Box>
                <Form/>
            </Box>
        </Page>
    );
}

export default PageForm;