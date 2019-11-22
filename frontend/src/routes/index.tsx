import {RouteProps} from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import categoryRoutes from "./resources/category";
import castMemberRoutes from "./resources/castMember";
import genreRoutes from "./resources/genre";

export interface MyRouteProps extends RouteProps{
    label : string;
    name: string;
}

var routes: MyRouteProps[] = [
    {
        name:'dashboard',
        label: 'Dashboard',
        path:'/',
        component: Dashboard,
        exact: true
    },
    ...categoryRoutes,
    ...castMemberRoutes,
    ...genreRoutes

];



export default routes;