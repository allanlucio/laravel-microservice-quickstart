import * as React from 'react';
import {useState,useEffect} from "react";
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import { Chip } from '@material-ui/core';
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import categoryHttp from '../../util/http/category-http';
import { Category, ListResponse } from '../../util/models';
import DefaultTable, {TableColumn} from '../../components/Table';

const columnsDefinition: TableColumn[] = [
    {
        name:'id',
        label:'ID',
        width:"30%",
        options:{
            sort: false
        }
    },
    {
        name:'name',
        label:'Nome',
        width:"43%"
    },
    {
        name:'is_active',
        label:'Ativo?',
        width:"4%",
        options:{
            customBodyRender(value, tableMeta,updateValue){
                
                return value ? <Chip label="Sim" color="primary"></Chip>: <Chip color="secondary" label="Não"></Chip>;
            }
        }
    },
    {
        name:'created_at',
        label:'Criado em',
        width:"10%",
        options:{
            customBodyRender(value, tableMeta,updateValue){
                
                return <span>{format(parseISO(value),"dd/MM/yyyy")}</span>
            }
        }
    },
    {
        name:'actions',
        label:'Ações',
        width:"13%",
          
        
    },
];

export const Table: React.FC = ()=>{

    const [data, setData] = useState<Category[]>([]);
    console.log(process.env);
    useEffect(()=>{
        let isSubscribed = true;
        (async function getCategories(){
            try{
                const {data}= await categoryHttp.list<ListResponse<Category>>();
                if(isSubscribed){
                    setData(data.data);
                }
                
            }catch(error){
                console.error(error);
            }
            
        })();

        return () => {
            isSubscribed = false;
        }
        
    },[]);

    return (
       <DefaultTable title="Listagem de categorias" columns={columnsDefinition} data={data}/>
    );
}

export default Table;