import * as React from 'react';
import {useState,useEffect} from "react";
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import { httpVideo } from '../../util/http';
import { Chip } from '@material-ui/core';
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import castMemberHttp from '../../util/http/cast-member-http';
import { CastMember } from '../../util/models/cast-member';
import { BadgeYes, BadgeNo } from '../../components/Badge';



const castMemberTypeMap = {
        0:"Ator",
        1:"Diretor"
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
                
                return value ? <BadgeYes label={type}/>: <BadgeNo label={type}/>;
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