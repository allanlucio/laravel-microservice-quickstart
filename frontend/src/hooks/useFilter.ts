import {useState,useEffect, useRef, useReducer, Dispatch, Reducer} from "react";
import reducer, { INITIAL_STATE, Creators, Types } from '../store/filter';
import { State as FilterState, Actions as FilterActions } from "../store/filter/types";
import { MUIDataTableColumn } from "mui-datatables";
import {useDebounce} from "use-debounce";
import { useHistory } from "react-router";
import {History} from 'history';

interface FilterManagerOptions{
    columns: MUIDataTableColumn[];
    rownPerPage: number;
    RowsPerPageOptions: number[];
    debounceTime: number;
    history: History;
}

interface useFilterOptions extends Omit<FilterManagerOptions, 'history'>{

}

export default function useFilter(options: useFilterOptions){
    const history = useHistory();
    const filterManager = new FilterManager({...options, history});
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [filterState, dispatch] = useReducer<Reducer<FilterState, FilterActions>>(reducer, INITIAL_STATE);
    const [debouncedFilterState] = useDebounce(filterState,options.debounceTime);
    filterManager.state = filterState;
    filterManager.dispatch = dispatch;
    filterManager.applyOrderInColumns();
    return {
        filterState,dispatch,totalRecords,setTotalRecords,filterManager,debouncedFilterState
    }

}

export class FilterManager {
    state: FilterState = null as any;
    dispatch: Dispatch<FilterActions> = null as any;
    columns: MUIDataTableColumn[];
    rownPerPage: number;
    RowsPerPageOptions: number[];
    history: History;

    
    
    constructor(options:FilterManagerOptions){
        this.columns = options.columns;
        this.rownPerPage = options.rownPerPage;
        this.RowsPerPageOptions = options.RowsPerPageOptions;
        this.history = options.history;
        
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

    pushHistory(){
        const newLocation = {
            pathname:this.history.location.pathname,
            search: '?'+new URLSearchParams(this.formatSearchParams() as any),
            state:{
                ...this.state,
                search: this.cleanSearchText(this.state.search)
            }
        }
        this.history.push(newLocation);
    }

    private formatSearchParams(){
        const search = this.cleanSearchText(this.state.search);
        return {
            ...(search && search !== '' && {search : search} ),
            ...(this.state.pagination.page > 1 && {page: this.state.pagination.page}),
            ...(this.state.pagination.per_page !== 15 && {per_page: this.state.pagination.per_page}),
            ...(this.state.order.sort && {
                sort: this.state.order.sort,
                dir: this.state.order.dir,
            })
        }
    }

}