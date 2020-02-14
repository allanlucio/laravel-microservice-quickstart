import * as React from 'react';
import { useState, useEffect, useRef } from "react";
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import { httpVideo } from '../../util/http';
import { Chip } from '@material-ui/core';
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import videoHttp from '../../util/http/video-http';
import { Category, Video, ListResponse, Genre } from '../../util/models';
import DefaultTable, { TableColumn, MuiDatatableRefComponent } from '../../components/Table';
import { Link } from 'react-router-dom';
import useFilter from '../../hooks/useFilter';
import { FilterResetButton } from '../../components/Table/FilterResetButton';
import EditIcon from "@material-ui/icons/Edit";
import { BadgeYes, BadgeNo } from '../../components/Badge';
import { useSnackbar } from 'notistack';
import * as yup from '../../util/vendor/yup';
import categoryHttp from '../../util/http/category-http';
import DatatableExtraFilterHelper from '../../hooks/useFilter/datatableExtraFilterHelper';
import { CategoryExtraFilterDefinition } from '../../util/extra-filters/CategoryExtraFilter';
import genreHttp from '../../util/http/genre-http';
import GenreExtraFilterDefinition from '../../util/extra-filters/GenreExtraFilter';




const columnsDefinition: TableColumn[] = [
    {
        name: 'id',
        label: 'ID',
        width: "30%",
        options: {
            filter: false,
            sort: false
        }
    },
    {
        name: 'title',
        label: 'Título',
        width: "30%",
        options: {
            filter: false,

        }

    },
    {
        name: 'genres',
        label: 'Gêneros',
        width: "35%",

        options: {
            filterType: 'multiselect',
            filterOptions: {
                names: []
            },
            sort: false,
            customBodyRender(value, tableMeta, updateValue) {


                return value.map((element: Genre) => element.name).join(", ");
            }
        }
    },
    {
        name: 'categories',
        label: 'Categorias',
        width: "35%",

        options: {
            filterType: 'multiselect',
            filterOptions: {
                names: []
            },
            sort: false,
            customBodyRender(value, tableMeta, updateValue) {


                return value.map((element: Category) => element.name).join(", ");
            }
        }
    },
    {
        name: 'created_at',
        label: 'Criado em',
        width: "10%",

        options: {
            filter: false,
            customBodyRender(value, tableMeta, updateValue) {

                return <span>{format(parseISO(value), "dd/MM/yyyy")}</span>
            }
        }
    },
    {
        name: 'actions',
        label: 'Ações',
        width: "13%",
        options: {
            filter: false,
            sort: false,
            customBodyRender(value, tableMeta, updateValue) {

                const id = tableMeta.rowData[0];
                return <Link to={`/videos/${id}/edit`}>  <EditIcon color={'primary'}></EditIcon></Link>
            }
        }


    }
];


const debouncedTime = 300;
const debouncedSearchTime = 300;
const rowsPerPage = 15;
const rowsPerPageOptions = [15, 25, 50];
export const Table: React.FC = () => {

    const snackbar = useSnackbar();
    const subscribed = useRef(true);
    const tableRef = useRef() as React.MutableRefObject<MuiDatatableRefComponent>;
    const [data, setData] = useState<Video[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const {
        filterState,
        dispatch,
        totalRecords,
        setTotalRecords,
        filterManager,
        debouncedFilterState } =

        useFilter({

            columns: columnsDefinition,
            debounceTime: debouncedTime,
            rowsPerPage: rowsPerPage,
            rowsPerPageOptions,
            tableRef,
            extraFilter: [CategoryExtraFilterDefinition, GenreExtraFilterDefinition]
        });

    const datatableHelper = new DatatableExtraFilterHelper(
        columnsDefinition, filterState, debouncedFilterState, ['categories', 'genres']
    ); 
    const serverSideFilterList = datatableHelper.serverSideFilterList;
    
    useEffect(() => {
        (async () => {
            try {
                const categoryPromise = categoryHttp.list<ListResponse<Category>>({ queryParams: { all: '' } });
                const genrePromise = genreHttp.list<ListResponse<Genre>>({ queryParams: { all: '' } });
                const [{data:categoryData} ,{data:genreData}]= await Promise.all([categoryPromise, genrePromise]);
                
                console.log(categoryData);
                if (subscribed.current) {
                    datatableHelper.setColumnFilterOptions(
                        'categories',
                        categoryData.data.map(category => category.name)
                    )
                    datatableHelper.setColumnFilterOptions(
                        'genres',
                        genreData.data.map(genre => genre.name)
                    )
                }

            } catch (error) {
                
                if (categoryHttp.isCancelledRequest(error)) {
                    return;
                }
                console.error(error);
                snackbar.enqueueSnackbar(
                    "Não foi possivel carregar as informações",
                    { variant: "error" });
            }
        })();
        return () => {
            subscribed.current = false;
        }
    }, [])

    useEffect(() => {
        subscribed.current = true;
        filterManager.pushHistory();
        getData();
        return () => {

            subscribed.current = false;

        }
    }, [
        filterManager.cleanSearchText(debouncedFilterState.search),
        debouncedFilterState.pagination.page,
        debouncedFilterState.pagination.per_page,
        debouncedFilterState.order,
        debouncedFilterState.extraFilter

    ]);

    async function getData() {
        setLoading(true);
        try {
            const queryParams=datatableHelper.getFilterParams();
            
            const { data } = await videoHttp.list<ListResponse<Video>>({
                queryParams: {
                    search: filterManager.cleanSearchText(filterState.search),
                    ...queryParams
                }
            });
            if (subscribed.current) {
                setData(data.data);
                setTotalRecords(data.meta.total);
            }

        } catch (error) {

            if (videoHttp.isCancelledRequest(error)) {
                return;
            }
            snackbar.enqueueSnackbar(
                "Não foi possivel carregar as informações",
                { variant: "error" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <DefaultTable

            loading={loading}
            title="Listagem de Videos"
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
                onFilterChange: (column, filterList, type) => {
                    const columnIndex = columnsDefinition.findIndex(c => c.name === column);
                    filterManager.changeExtraFilter({
                        [column]: filterList[columnIndex].length ? filterList[columnIndex] : null
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