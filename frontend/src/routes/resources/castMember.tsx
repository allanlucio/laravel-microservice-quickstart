import CastMemberList from "../../pages/cast-member/PageList";
import CastMemberForm from "../../pages/cast-member/PageForm";

const castMemberRoutes: any[] = [
    
    {
        name:'cast_members.list',
        label: 'Listar Membros',
        path:'/cast-members',
        component: CastMemberList,
        exact: true
    }
    ,
    {
        name:'cast_members.create',
        label: 'Criar Membro',
        path:'/cast-members/create',
        component: CastMemberForm,
        exact: true
    }
    ,
    {
        name:'cast_members.edit',
        label: 'Editar Membro',
        path:'/cast-members/:id/edit',
        component: CastMemberList,
        exact: true
    }
]





export default castMemberRoutes;