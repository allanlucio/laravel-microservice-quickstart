import GenreList from "../../pages/genre/PageList";
import GenreForm from "../../pages/genre/PageForm";


const genreRoutes: any[] = [
    
    {
        name:'genres.list',
        label: 'Listar Gêneros',
        path:'/genres',
        component: GenreList,
        exact: true
    }
    ,
    {
        name:'genres.create',
        label: 'Criar Gêneros',
        path:'/genres/create',
        component: GenreForm,
        exact: true
    }
    ,
    {
        name:'genres.edit',
        label: 'Editar Gêneros',
        path:'/genres/:id/edit',
        component: GenreList,
        exact: true
    }
]





export default genreRoutes;