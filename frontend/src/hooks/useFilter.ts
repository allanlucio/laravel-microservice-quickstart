import {useState,useEffect, useRef, useReducer, Dispatch, Reducer} from "react";
import reducer, { Creators, Types } from '../store/filter';
import { State as FilterState, Actions as FilterActions } from "../store/filter/types";
import { MUIDataTableColumn } from "mui-datatables";
import {useDebounce} from "use-debounce";
import { useHistory } from "react-router";
import {History} from 'history';
import {isEqual} from 'lodash';
import * as yup from '../util/vendor/yup';
import { MuiDatatableRefComponent } from "../components/Table";


interface FilterManagerOptions{
    columns: MUIDataTableColumn[];
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    debounceTime: number;
    history: History;
    tableRef: React.MutableRefObject<MuiDatatableRefComponent>;
    extraFilter?: ExtraFilter;
}

interface ExtraFilter{
    getStateFromUrl: (queryParams: URLSearchParams) => any
    formatSearchParams: (debouncedState: FilterState) => any
    createValidationSchema:() => any
}

interface useFilterOptions extends Omit<FilterManagerOptions, 'history'>{

}

export default function useFilter(options: useFilterOptions){
    const history = useHistory();
    const filterManager = new FilterManager({...options, history});
    const INITIAL_STATE = filterManager.getStateFromUrl();
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [filterState, dispatch] = useReducer<Reducer<FilterState, FilterActions>>(reducer, INITIAL_STATE);
    const [debouncedFilterState] = useDebounce(filterState,options.debounceTime);
    filterManager.state = filterState;
    filterManager.debouncedState = debouncedFilterState;
    filterManager.dispatch = dispatch;
    filterManager.applyOrderInColumns();
    useEffect(() => {
        filterManager.replaceHistory();
    }, []);
    return {
        filterState,dispatch,totalRecords,setTotalRecords,filterManager,debouncedFilterState
    }

}

export class FilterManager {
    schema;
    state: FilterState = null as any;
    dispatch: Dispatch<FilterActions> = null as any;
    columns: MUIDataTableColumn[];
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    history: History;
    tableRef: React.MutableRefObject<MuiDatatableRefComponent>;
    debouncedState: FilterState = null as any;
    extraFilter?: ExtraFilter;

    
    
    constructor(options:FilterManagerOptions){
        this.columns = options.columns;
        this.rowsPerPage = options.rowsPerPage;
        this.rowsPerPageOptions = options.rowsPerPageOptions;
        this.history = options.history;
        this.tableRef = options.tableRef;
        this.extraFilter = options.extraFilter;
        this.createValidationSchema();
        
        
    }

    changeSearch(value){
        this.dispatch(Creators.setSearch({search:value}));
    }
    changePage(page){
        this.dispatch(Creators.setPage({page:page+1}))
    }
    changeRowsPerPage(perPage){
        this.dispatch(Creators.setPerPage({per_page:perPage}));
    } 
    changeColumnSort(changedColumn, direction){
        this.dispatch(Creators.setOrder({   
            sort: changedColumn, 
            dir:direction.includes('desc')? "desc":'asc'}));

        this.resetTablePagination();
    }
    changeExtraFilter(data){
        console.log(data, "Change Extra Filter");
        this.dispatch(Creators.updateExtraFilter(data));

        
    }

    
    resetFilter(){
        const INITIAL_STATE = {
            ...this.schema.cast({}),
            search: {value:null, update:true},
            
        };
        this.dispatch(Creators.setReset({state:INITIAL_STATE}));
        this.resetTablePagination();
    } 

    private resetTablePagination(){
        this.tableRef.current.changeRowsPerPage(this.rowsPerPage);
        this.tableRef.current.changePage(0);
    }
    applyOrderInColumns(){
        this.columns = this.columns.map(column => {
            if(column.name === this.state.order.sort){
    
                return {
                    ...column,
                    options:{
                        ...column.options,
                        sortDirection:this.state.order.dir as any
                    }
                };
                
            }
    
            return column;
            
        });
    }

    cleanSearchText(text){
        let newText = text;
        if(text && text.value !== undefined){
            newText = text.value;
        }

        return newText;
    }

    replaceHistory(){
        this.history.replace({
            pathname:this.history.location.pathname,
            search: '?'+new URLSearchParams(this.formatSearchParams() as any),
            state: this.debouncedState
        })
    }
    pushHistory(){
        console.log('push history');
        const newLocation = {
            pathname:this.history.location.pathname,
            search: '?'+new URLSearchParams(this.formatSearchParams() as any),
            state:{
                ...this.debouncedState,
                search: this.cleanSearchText(this.debouncedState.search)
            }
        }
        const oldState = this.history.location.state;
        const nextState = this.debouncedState;
        if(isEqual(oldState,nextState)){
            console.log('pushHistory Equal')
            return;
        }

        this.history.push(newLocation);

        
    }

    private formatSearchParams(){
        const search = this.cleanSearchText(this.debouncedState.search);
        return {
            ...(search && search !== '' && {search : search} ),
            ...(this.debouncedState.pagination.page > 1 && {page: this.debouncedState.pagination.page}),
            ...(this.debouncedState.pagination.per_page !== 15 && {per_page: this.debouncedState.pagination.per_page}),
            ...(this.debouncedState.order.sort && {
                sort: this.debouncedState.order.sort,
                dir: this.debouncedState.order.dir,
            }),
            ...(
                this.extraFilter && this.extraFilter.formatSearchParams(this.debouncedState)
            )
        }
    }
    getStateFromUrl(){
        const queryParams = new URLSearchParams(this.history.location.search.substr(1));
        const state = this.schema.cast({
            search: queryParams.get('search'),
            pagination : {
                page: queryParams.get('page'),
                per_page: queryParams.get('per_page')
            },
            order : {
                sort: queryParams.get('sort'),
                dir: queryParams.get('dir')
            },
            ...(
                this.extraFilter && {
                    extraFilter:this.extraFilter.getStateFromUrl(queryParams)
                }
            )
        });
        console.log(state);
        return state;
    }
    private createValidationSchema(){
        this.schema = yup.object().shape({
            search: yup.string()
                .transform(value => !value ? undefined : value)
                .default(''),
            pagination: yup.object().shape({
                page: yup.number()
                    .transform(value => isNaN(value) || parseInt(value) <1 ? undefined: value)
                    .default(1),
                per_page: yup.number()
                    
                    .transform(value => {
                        console.log(value);
                        return isNaN(value) || !this.rowsPerPageOptions.includes(parseInt(value)) ? undefined : value;
                    })
                    .default(this.rowsPerPage)
            }),
            order: yup.object().shape({
                sort: yup.string()
                    .nullable()
                    .transform(value => {
                        const columnsName = this.columns
                            .filter(column => !column.options || column.options.sort !== false)
                            .map(column => column.name);
                        return columnsName.includes(value) ? value : undefined
                    })
                    .default(null),
                per_page: yup.number()
                    .nullable()
                    .transform(value => !value || !['asc','desc'].includes(value.toLowerCase()? undefined : value))
                    .default(null)
            }),
            ...(
                this.extraFilter && {extraFilter: this.extraFilter.createValidationSchema()}
            )
                
            

        })
    }

}