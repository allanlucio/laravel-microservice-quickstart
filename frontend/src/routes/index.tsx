import {RouteProps} from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import CategoryList from "../pages/category/PageList";

export interface MyRouteProps extends RouteProps{
    label : string;
    name: string;
}

const routes: MyRouteProps[] = [
    {
        name:'dashboard',
        label: 'Dashboard',
        path:'/',
        component: Dashboard,
        exact: true
    },
    {
        name:'categories.list',
        label: 'Listar Categorias',
        path:'/categories',
        component: CategoryList,
        exact: true
    }
    ,
    {
        name:'categories.create',
        label: 'Criar Categorias',
        path:'/categories/create',
        component: CategoryList,
        exact: true
    }
    ,
    {
        name:'categories.edit',
        label: 'Editar Categorias',
        path:'/categories/:id/edit',
        component: CategoryList,
        exact: true
    }
];

export default routes;