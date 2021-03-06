import * as React from 'react';
import {useState,useEffect, useRef, useContext} from "react";
import { Chip } from '@material-ui/core';
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import categoryHttp from '../../util/http/category-http';
import { Category, ListResponse } from '../../util/models';
import DefaultTable, {TableColumn, MuiDatatableRefComponent} from '../../components/Table';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import EditIcon from "@material-ui/icons/Edit";
import { FilterResetButton } from '../../components/Table/FilterResetButton';
import useFilter from '../../hooks/useFilter';
import { BadgeYes, BadgeNo } from '../../components/Badge';
import LoadingContext from '../../components/loading/LoadingContext';

const columnsDefinition: TableColumn[] = [
    {
        name:'id',
        label:'ID',
        width:"30%",
        options:{
            filter:false,
            sort: false
        }
    },
    {
        name:'name',
        label:'Nome',
        width:"43%",
        options:{
            filter:false,
            
        }  
    },
    {
        name:'is_active',
        label:'Ativo?',
        width:"4%",
        options:{  
            filterOptions:{
                names:['Sim','Não']
            },
            customBodyRender(value, tableMeta,updateValue){
                
                return value ? <BadgeYes label={"Sim"}/>: <BadgeNo label={"Não"}/>;
            }
        }
    },
    {
        name:'created_at',
        label:'Criado em',
        width:"10%",
        options:{
            filter:false,
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
            sort: false,
            filter:false,
            customBodyRender(value, tableMeta,updateValue){
                
                const id = tableMeta.rowData[0];
                return <Link to={`/categories/${id}/edit`}>  <EditIcon color={'primary'}></EditIcon></Link>
            }
        }

        
    },
];

const debouncedTime = 300;
const debouncedSearchTime = 300;
const rowsPerPage = 15;
const rowsPerPageOptions = [15,25,50];
export const Table: React.FC = ()=>{
    
    const snackbar = useSnackbar();
    const subscribed = useRef(true);
    const tableRef = useRef() as React.MutableRefObject<MuiDatatableRefComponent>;
    const [data, setData] = useState<Category[]>([]);
    const loading = useContext(LoadingContext);

    // const [loading, setLoading] = useState<boolean>(false);
    const {
        filterState,
        dispatch,
        totalRecords,
        setTotalRecords, 
        filterManager,
        debouncedFilterState} = 
        
        useFilter({
            
        columns:columnsDefinition,
        debounceTime: debouncedTime,
        rowsPerPage:rowsPerPage,
        rowsPerPageOptions,
        tableRef 
    });

    

    useEffect(()=>{
        subscribed.current = true;
        filterManager.pushHistory();
        getData();
        return () => {
            
            subscribed.current = false;

        }
    },[
        filterManager.cleanSearchText(debouncedFilterState.search), 
        debouncedFilterState.pagination.page, 
        debouncedFilterState.pagination.per_page, 
        debouncedFilterState.order]);

    async function getData(){
            try{
                
                const {data}= await categoryHttp.list<ListResponse<Category>>({
                    queryParams:{
                        search: filterManager.cleanSearchText(filterState.search),
                        page: filterState.pagination.page,
                        per_page: filterState.pagination.per_page,
                        sort: filterState.order.sort,
                        dir: filterState.order.dir,

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
            }
    }

    

    return (
       <DefaultTable
            
            loading={loading} 
            title="Listagem de categorias" 
            columns={filterManager.columns} 
            data={data} 
            debouncedSearchTime={debouncedSearchTime}
            ref={tableRef} 
            options={{
                
                serverSide:true,
                responsive: "scrollMaxHeight",
                searchText: filterState.search as any,
                page: filterState.pagination.page-1,
                rowsPerPage: filterState.pagination.per_page,
                rowsPerPageOptions,
                count: totalRecords,
                customToolbar: () =>(
                    <FilterResetButton 
                    handleClick={
                        ()=>filterManager.resetFilter()
                    }/>
                ),
                onSearchChange: (value) => filterManager.changeSearch(value),
                onChangePage: (page) => filterManager.changePage(page),
                onChangeRowsPerPage: (perPage) => filterManager.changeRowsPerPage(perPage),
                onColumnSortChange: (changedColumn, direction) => filterManager.changeColumnSort(changedColumn,direction)

            }} 
        />
    );
}

export default Table;