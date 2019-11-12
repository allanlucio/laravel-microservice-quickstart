import React from "react";
import {RouteProps, Route} from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import CategoryList from "../pages/category/List";
import {Switch} from 'react-router-dom';
import routes from "./index";

type Props = {

}

const AppRouter: React.FC = (props: Props)=>{
    
    return (
        <Switch>
            {
                routes.map(
                    (route, key) => (
                        <Route
                            key={key}
                            path={route.path}
                            component = {route.component}
                            exact = {route.exact === true}
                        />
                    )
                )
            }
        </Switch>
    );
}

export default AppRouter;