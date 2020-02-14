import { State as FilterState } from "../../store/filter/types";
import { isArray } from "util";



export default class DatatableExtraFilterHelper {
    columnsDefinition: any[];
    extraFilterColumns: string[];
    filterState: FilterState;
    debouncedFilterState: FilterState;
    serverSideFilterList: any[];

    constructor(columnsDefinition, filterState, debouncedFilterState, extraFilterColumns) {
        this.columnsDefinition = columnsDefinition;
        this.filterState = filterState;
        this.debouncedFilterState = debouncedFilterState;
        this.extraFilterColumns = extraFilterColumns;
        this.serverSideFilterList = this.columnsDefinition.map(column => []);
        this.extraFilterColumns.forEach((columnName, key) => {
            const columnIndex = this.getColumnIndex(columnName);
            const filterValues = this.getFilterValues(columnName);
            this.setColumnFilterList(columnIndex, filterValues)
            this.setServerSideList(columnIndex, filterValues)
        });
    }

    setColumnFilterOptions(columnName, data) {
        const column = this.columnsDefinition[this.getColumnIndex(columnName)];
        (column.options as any).filterOptions.names = data;
        console.log("oioioioi");
    }
    setServerSideList(columnIndex, filterValues) {
        if (filterValues) {
            this.serverSideFilterList[columnIndex] = filterValues;
        }
    }

    getFilterParams() {
        const extraFilter = this.debouncedFilterState.extraFilter;
        const extraParams = {};
        this.extraFilterColumns.forEach((column) => {
            if(extraFilter && extraFilter[column]){
                extraParams[column] = extraFilter[column].join(",");
            }
            
        });
        return {
            page: this.debouncedFilterState.pagination.page,
            per_page: this.debouncedFilterState.pagination.per_page,
            sort: this.debouncedFilterState.order.sort,
            dir: this.debouncedFilterState.order.dir,
            ...extraParams
        }
    }
    setColumnFilterList(columnIndex, filterValues) {
        const column = this.columnsDefinition[columnIndex];
        (column.options as any).filterList = filterValues
            ? filterValues
            : [];
    }
    getColumnIndex(columnName) {
        return this.columnsDefinition.findIndex(c => c.name === columnName);
    }
    getFilterValues(columnName) {
        const filterValue = this.filterState.extraFilter && this.filterState.extraFilter[columnName];
        console.log(filterValue, "filterValue");

        if (filterValue !== null && filterValue !== "" && filterValue !== undefined && !isArray(filterValue)) {
            return [filterValue];
        }
        return filterValue;
    }

}