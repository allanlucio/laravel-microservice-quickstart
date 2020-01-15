import {useState,useEffect, useRef, useReducer, Dispatch, Reducer} from "react";
import reducer, { INITIAL_STATE, Creators, Types } from '../store/filter';
import { State as FilterState, Actions as FilterActions } from "../store/filter/types";
import { MUIDataTableColumn } from "mui-datatables";
import {useDebounce} from "use-debounce";

interface FilterManagerOptions{
    columns: MUIDataTableColumn[];
    rownPerPage: number;
    RowsPerPageOptions: number[];
    debounceTime: number;
}


export default function useFilter(options: FilterManagerOptions){
    const filterManager = new FilterManager(options);
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
    
    
    constructor(options:FilterManagerOptions){
        this.columns = options.columns;
        this.rownPerPage = options.rownPerPage;
        this.RowsPerPageOptions = options.RowsPerPageOptions;
        
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

}