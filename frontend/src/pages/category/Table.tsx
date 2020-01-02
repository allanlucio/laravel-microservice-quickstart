import * as React from 'react';
import {useState,useEffect, useRef} from "react";
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import { Chip } from '@material-ui/core';
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import categoryHttp from '../../util/http/category-http';
import { Category, ListResponse } from '../../util/models';
import DefaultTable, {TableColumn} from '../../components/Table';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import EditIcon from "@material-ui/icons/Edit";


interface Pagination{
    page: number,
    total: number,
    per_page: number
}

interface SearchState {
    search: string;
    pagination: Pagination
}

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
        options:{
            customBodyRender(value, tableMeta,updateValue){
                
                const id = tableMeta.rowData[0];
                return <Link to={`/categories/${id}/edit`}>  <EditIcon color={'primary'}></EditIcon></Link>
            }
        }
          
        
    },
];

export const Table: React.FC = ()=>{
    
    const snackbar = useSnackbar();
    const subscribed = useRef(true);
    const [data, setData] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchState, setSearchState] = useState<SearchState>({
        search: '',
        pagination:{
            page:1,
            total:0,
            per_page: 10
        }
    });
    

    

    useEffect(()=>{
        subscribed.current = true;
        getData();
        return () => {
            subscribed.current = false;
        }
    },[searchState.search, searchState.pagination.page, searchState.pagination.per_page]);

    async function getData(){
        setLoading(true);
            try{
                const {data}= await categoryHttp.list<ListResponse<Category>>({
                    queryParams:{
                        search: searchState.search,
                        page: searchState.pagination.page,
                        per_page: searchState.pagination.per_page

                    }
                });
                if(subscribed.current){
                    setData(data.data);
                    setSearchState((prevState)=>({
                        ...prevState,
                        pagination: {
                            ...prevState.pagination,
                            total: data.meta.total
                        }
                    }));
                }
                
            }catch(error){
                console.error(error);
                snackbar.enqueueSnackbar("Não foi possivel carregar as informações",{variant:"error"});
            }finally{
                setLoading(false);
            }
    }
    return (
       <DefaultTable 
            loading={loading} 
            title="Listagem de categorias" 
            columns={columnsDefinition} 
            data={data} 
            options={{
                serverSide:true,
                responsive: "scrollMaxHeight",
                searchText: searchState.search,
                page: searchState.pagination.page-1,
                rowsPerPage: searchState.pagination.per_page,
                count: searchState.pagination.total,
                onSearchChange: (value) => setSearchState((prevState)=>({
                    ...prevState,
                    search:value
                })),
                onChangePage: (page) => setSearchState((prevState)=>({
                    ...prevState,
                    pagination:{
                        ...prevState.pagination,
                        page:page +1
                    }
                })),
                onChangeRowsPerPage: (perPage) => setSearchState((prevState)=>({
                    ...prevState,
                    pagination:{
                        ...prevState.pagination,
                        per_page:perPage
                    }
                })),

            }} 
        />
    );
}

export default Table;