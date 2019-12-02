import * as React from 'react';
import {useState,useEffect} from "react";
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import { httpVideo } from '../../util/http';
import { Chip } from '@material-ui/core';
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import castMemberHttp from '../../util/http/cast-member-http';



const castMemberTypeMap = {
        0:"Diretor",
        1:"Ator"
    }

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
                let type = castMemberTypeMap[value];
                
                return value ? <Chip label={type} color="primary"></Chip>: <Chip color="secondary" label={type}></Chip>;
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

interface CastMember{
    id: string;
    name: string;
}

export const Table: React.FC = ()=>{

    const [data, setData] = useState<CastMember[]>([]);
    
    useEffect(()=>{
        castMemberHttp
            .list<{data: CastMember[]}>()
            .then(({data}) => setData(data.data)
        )
        
    },[]);

    return (
       <MUIDataTable title="Listagem de membros" columns={columnsDefinition} data={data}/>
    );
}

export default Table;