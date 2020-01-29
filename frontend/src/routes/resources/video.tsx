import VideoList from "../../pages/video/PageList";
import VideoForm from "../../pages/video/PageForm";


const videoRoutes: any[] = [
    
    {
        name:'videos.list',
        label: 'Listar Videos',
        path:'/videos',
        component: VideoList,
        exact: true
    }
    ,
    {
        name:'videos.create',
        label: 'Criar Videos',
        path:'/videos/create',
        component: VideoForm,
        exact: true
    }
    ,
    {
        name:'videos.edit',
        label: 'Editar Videos',
        path:'/videos/:id/edit',
        component: VideoForm,
        exact: true
    }
]





export default videoRoutes;