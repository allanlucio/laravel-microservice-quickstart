import CategoryList from "../../pages/category/PageList";
import CategoryForm from "../../pages/category/PageForm";


const categoryRoutes: any[] = [
    
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
        component: CategoryForm,
        exact: true
    }
    ,
    {
        name:'categories.edit',
        label: 'Editar Categoria',
        path:'/categories/:id/edit',
        component: CategoryForm,
        exact: true
    }
]





export default categoryRoutes;