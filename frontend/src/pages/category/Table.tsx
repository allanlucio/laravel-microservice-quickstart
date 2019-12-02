import * as React from 'react';
import {useState,useEffect} from "react";
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import { Chip } from '@material-ui/core';
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import categoryHttp from '../../util/http/category-http';
import { Category } from '../../util/models/category';

const columnsDefinition: MUIDataTableColumn[] = [
    {
        name:'name',
        label:'Nome'
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

export const Table: React.FC = ()=>{

    const [data, setData] = useState<Category[]>([]);
    console.log(process.env);
    useEffect(()=>{
        categoryHttp
            .list<{data: Category[]}>()
            .then(({data}) => setData(data.data)
        )
    },[]);

    return (
       <MUIDataTable title="Listagem de categorias" columns={columnsDefinition} data={data}/>
    );
}

export default Table;