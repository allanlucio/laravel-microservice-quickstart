import * as React from 'react';
import {useState,useEffect,useRef} from "react";
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import { httpVideo } from '../../util/http';
import { Chip } from '@material-ui/core';
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import castMemberHttp from '../../util/http/cast-member-http';
import { BadgeYes, BadgeNo } from '../../components/Badge';
import { CastMember, ListResponse, CastMemberTypeMap } from '../../util/models';
import DefaultTable, { TableColumn, MuiDatatableRefComponent } from '../../components/Table';
import { Link } from 'react-router-dom';
import EditIcon from "@material-ui/icons/Edit";
import { useSnackbar } from 'notistack';
import useFilter from '../../hooks/useFilter';
import { FilterResetButton } from '../../components/Table/FilterResetButton';
import * as yup from '../../util/vendor/yup';
import {invert} from 'lodash';



const castMemberNames = Object.values(CastMemberTypeMap);
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
        name:'type',
        label:'Tipo',
        width:"10%",
        options:{
            filterOptions:{
                names: castMemberNames
            },
            customBodyRender(value, tableMeta,updateValue){
                let type = CastMemberTypeMap[value];
                
                return value ? <BadgeYes label={type}/>: <BadgeNo label={type}/>;
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
                return <Link to={`/cast-members/${id}/edit`}>  <EditIcon color={'primary'}></EditIcon></Link>
            }
        }
        
    }
    

];

const debouncedTime = 300;
const debouncedSearchTime = 300;
const rowsPerPage = 15;
const rowsPerPageOptions = [15,25,50];
export const Table: React.FC = ()=>{

    const snackbar = useSnackbar();
    const subscribed = useRef(true);
    const tableRef = useRef() as React.MutableRefObject<MuiDatatableRefComponent>;
    const [data, setData] = useState<CastMember[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
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
        tableRef,
        extraFilter:{
            createValidationSchema:()=>{
                return yup.object().shape({
                    type:yup.string()
                        .nullable()
                        .transform(value => {
                            return !value || !castMemberNames.includes(value)?undefined: value;
                        })
                        .default(null)
                });
            },
            formatSearchParams: (debouncedState) => {
                return debouncedState.extraFilter?{
                    ...(
                        debouncedState.extraFilter.type &&
                        {type: debouncedState.extraFilter.type}
                    )
                }: undefined
            },
            getStateFromUrl: (queryParams) => {
                return {
                    type: queryParams.get('type')
                }
            }
        } 
    });
    const indexColumnType = columnsDefinition.findIndex(c=> c.name ==='type');
    const columnType = columnsDefinition[indexColumnType];
    const typeFilterValue = filterState.extraFilter && filterState.extraFilter.type as never;
    (columnType.options as any).filterList = typeFilterValue
        ? [typeFilterValue]
        :[];
    const serverSideFilterList = columnsDefinition.map(column => []);
    if(typeFilterValue){
        serverSideFilterList[indexColumnType] = [typeFilterValue];
    }

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
        debouncedFilterState.order,
        JSON.stringify(debouncedFilterState.extraFilter)
    ]);
    async function getData(){
        setLoading(true);
            try{
                
                const {data}= await castMemberHttp.list<ListResponse<CastMember>>({
                    queryParams:{
                        search: filterManager.cleanSearchText(debouncedFilterState.search),
                        page: debouncedFilterState.pagination.page,
                        per_page: debouncedFilterState.pagination.per_page,
                        sort: debouncedFilterState.order.sort,
                        dir: debouncedFilterState.order.dir,
                        ...(
                            debouncedFilterState.extraFilter &&
                            debouncedFilterState.extraFilter.type &&
                            {type: invert(CastMemberTypeMap)[debouncedFilterState.extraFilter.type]}
                        )

                    }
                });
                if(subscribed.current){
                    setData(data.data);
                    setTotalRecords(data.meta.total);
                }
                
            }catch(error){
                
                if(castMemberHttp.isCancelledRequest(error)){
                    return ;
                }
                snackbar.enqueueSnackbar(
                    "Não foi possivel carregar as informações",
                    {variant:"error"});
            }finally{
                setLoading(false);
            }
    }
    

    return (
        <DefaultTable
            loading={loading}
            title="Listagem dos membros de elenco"
            columns={filterManager.columns}
            data={data}
            debouncedSearchTime={debouncedSearchTime}
            ref={tableRef}
            options={{
                serverSideFilterList,
                serverSide: true,
                responsive: "scrollMaxHeight",
                searchText: filterState.search as any,
                page: filterState.pagination.page - 1,
                rowsPerPage: filterState.pagination.per_page,
                rowsPerPageOptions,
                count: totalRecords,
                onFilterChange: (column, filterList, type)=>{
                    const columnIndex = columnsDefinition.findIndex(c => c.name ===column);
                    filterManager.changeExtraFilter({
                        [column]: filterList[columnIndex].length ? filterList[columnIndex][0]: null
                    });
                },
                customToolbar: () => (
                    <FilterResetButton
                        handleClick={
                            () => filterManager.resetFilter()
                        } />
                ),
                onSearchChange: (value) => filterManager.changeSearch(value),
                onChangePage: (page) => filterManager.changePage(page),
                onChangeRowsPerPage: (perPage) => filterManager.changeRowsPerPage(perPage),
                onColumnSortChange: (changedColumn, direction) => filterManager.changeColumnSort(changedColumn, direction)

            }}
        />
    );
}

export default Table;