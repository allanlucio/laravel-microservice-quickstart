import * as React from 'react';
import { Page } from '../../components/Page';
import { Box } from '@material-ui/core';
import {Form} from "./Form";
import { useParams } from 'react-router';

const PageForm: React.FC = ()=>{
    const {id} = useParams();

    return (
        <Page title = {id ? "Editar Gênero" : 'Criar de Gênero'}>
            
            <Box>
                <Form/>
            </Box>
        </Page>
    );
}

export default PageForm;