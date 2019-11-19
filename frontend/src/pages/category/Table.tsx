import * as React from 'react';
import {useState,useEffect} from "react";
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import { httpVideo } from '../../util/http';


const columnsDefinition: MUIDataTableColumn[] = [
    {
        name:'name',
        label:'Nome'
    },
    {
        name:'is_active',
        label:'Ativo?'
    },
    {
        name:'created_at',
        label:'Criado em'
    },
];

const data = [
    
        {name:"teste1", is_active:'true', created_at:"2019-12-12"},
        {name:"teste2", is_active:'true', created_at:"2019-8-12"},
        {name:"teste3", is_active:'false', created_at:"2019-10-12"},
        {name:"teste4", is_active:'true', created_at:"2019-7-12"},
    
]

export const Table: React.FC = ()=>{

    const [data, setData] = useState([]);
    console.log(process.env);
    useEffect(()=>{
        httpVideo.get('categories').then(
            response => setData(response.data.data)
        )
    },[]);

    return (
       <MUIDataTable title="Listagem de categorias" columns={columnsDefinition} data={data}/>
    );
}

export default Table;