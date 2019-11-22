import * as React from 'react';
import {useState,useEffect} from "react";
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import { httpVideo } from '../../util/http';
import { Chip } from '@material-ui/core';
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";

const castMemberTypes: any[] = [
    {
        key:0,
        label:"Diretor"
    },
    {
        key:1,
        label:"Ator"
    },

]

const columnsDefinition: MUIDataTableColumn[] = [
    {
        name:'name',
        label:'Nome'
    },
    {
        name:'type',
        label:'Tipo',
        options:{
            customBodyRender(value, tableMeta,updateValue){
                let type = castMemberTypes.find(element => element.key === value);
                
                return value ? <Chip label={type.label} color="primary"></Chip>: <Chip color="secondary" label={type.label}></Chip>;
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

    const [data, setData] = useState([]);
    
    useEffect(()=>{
        httpVideo.get('cast_members').then(
            response => setData(response.data.data)
        )
    },[]);

    return (
       <MUIDataTable title="Listagem de membros" columns={columnsDefinition} data={data}/>
    );
}

export default Table;