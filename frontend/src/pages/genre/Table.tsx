import * as React from 'react';
import {useState,useEffect} from "react";
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import { httpVideo } from '../../util/http';
import { Chip } from '@material-ui/core';
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import genreHttp from '../../util/http/genre-http';
import { Category } from '../category/Table';



const columnsDefinition: MUIDataTableColumn[] = [
    {
        name:'name',
        label:'Nome'
    },
    {
        name:'categories',
        label:'Categorias',
        options:{
            customBodyRender(value, tableMeta,updateValue){
                
                
                return value.map((element: Category) => element.name).join(", ");
            }
        }
    },
    {
        name:'is_active',
        label:'Ativo?',
        options:{
            customBodyRender(value, tableMeta,updateValue){
                
                return value ? <Chip label="Sim" color="primary"></Chip>: <Chip color="secondary" label="Não"></Chip>;
            }
        }
    },
    {
        name:'created_at',
        label:'Criado em',
        options:{
            customBodyRender(value, tableMeta,updateValue){
                
                return <span>{format(parseISO(value),"dd/MM/yyyy")}</span>
            }
        }
    },
];

interface Genre{
    id: string;
    name: string;
}

export const Table: React.FC = ()=>{

    const [data, setData] = useState<Genre[]>([]);
    
    useEffect(()=>{
        genreHttp
            .list<{data: Genre[]}>()
            .then(({data}) => setData(data.data)
        )
    },[]);

    return (
       <MUIDataTable title="Listagem de Gêneros" columns={columnsDefinition} data={data}/>
    );
}

export default Table;