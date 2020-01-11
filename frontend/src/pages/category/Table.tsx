import * as React from 'react';
import {useState,useEffect, useRef, useReducer} from "react";
import { Chip } from '@material-ui/core';
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import categoryHttp from '../../util/http/category-http';
import { Category, ListResponse } from '../../util/models';
import DefaultTable, {TableColumn} from '../../components/Table';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import EditIcon from "@material-ui/icons/Edit";
import { FilterResetButton } from '../../components/Table/FilterResetButton';
import reducer, { INITIAL_STATE, Creators, Types } from '../../store/search';

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
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [searchState, dispatch] = useReducer(reducer, INITIAL_STATE);
    // const [searchState, setSearchState] = useState<SearchState>(inititalState);
    

    const columns = columnsDefinition.map(column => {
        if(column.name === searchState.order.sort){

            return {
                ...column,
                options:{
                    ...column.options,
                    sortDirection:searchState.order.dir as any
                }
            };
            
        }

        return column;
        
    });

    useEffect(()=>{
        subscribed.current = true;
        getData();
        return () => {
            subscribed.current = false;
        }
    },[searchState.search, searchState.pagination.page, searchState.pagination.per_page, searchState.order]);

    async function getData(){
        setLoading(true);
            try{
                
                const {data}= await categoryHttp.list<ListResponse<Category>>({
                    queryParams:{
                        search: cleanSearchText(searchState.search),
                        page: searchState.pagination.page,
                        per_page: searchState.pagination.per_page,
                        sort: searchState.order.sort,
                        dir: searchState.order.dir,

                    }
                });
                if(subscribed.current){
                    setData(data.data);
                    setTotalRecords(data.meta.total);
                }
                
            }catch(error){
                
                if(categoryHttp.isCancelledRequest(error)){
                    return ;
                }
                snackbar.enqueueSnackbar(
                    "Não foi possivel carregar as informações",
                    {variant:"error"});
            }finally{
                setLoading(false);
            }
    }

    function cleanSearchText(text){
        let newText = text;
        if(text && text.value !== undefined){
            newText = text.value;
        }

        return newText;
    }

    return (
       <DefaultTable 
            loading={loading} 
            title="Listagem de categorias" 
            columns={columns} 
            data={data} 
            debouncedSearchTime={500}
            options={{
                serverSide:true,
                responsive: "scrollMaxHeight",
                searchText: searchState.search as any,
                page: searchState.pagination.page-1,
                rowsPerPage: searchState.pagination.per_page,
                count: totalRecords,
                customToolbar: () =>(
                    <FilterResetButton 
                    handleClick={()=>dispatch(Creators.setReset())
                    
                    }/>
                ),
                onSearchChange: (value) => dispatch(Creators.setSearch({search:value})),
                onChangePage: (page) => dispatch(Creators.setPage({page:page+1})),
                onChangeRowsPerPage: (perPage) => dispatch(Creators.setPerPage({per_page:perPage})),
                onColumnSortChange: (changedColumn, direction) => dispatch(Creators.setOrder(
                    {sort: changedColumn, dir:direction.includes('desc')? "desc":'asc'})),

            }} 
        />
    );
}

export default Table;