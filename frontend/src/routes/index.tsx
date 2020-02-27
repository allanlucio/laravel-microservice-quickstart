import {RouteProps} from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import categoryRoutes from "./resources/category";
import castMemberRoutes from "./resources/castMember";
import genreRoutes from "./resources/genre";
import videoRoutes from "./resources/video";
import uploadRoutes from "./resources/upload";

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
    ...genreRoutes,
    ...videoRoutes,
    ...uploadRoutes

];



export default routes;