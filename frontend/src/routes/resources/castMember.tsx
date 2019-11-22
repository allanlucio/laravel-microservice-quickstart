import CastMemberList from "../../pages/castMember/PageList";


const castMemberRoutes: any[] = [
    
    {
        name:'cast_members.list',
        label: 'Listar Membros',
        path:'/cast_members',
        component: CastMemberList,
        exact: true
    }
    ,
    {
        name:'cast_members.create',
        label: 'Criar Membro',
        path:'/cast_members/create',
        component: CastMemberList,
        exact: true
    }
    ,
    {
        name:'cast_members.edit',
        label: 'Editar Membro',
        path:'/cast_members/:id/edit',
        component: CastMemberList,
        exact: true
    }
]





export default castMemberRoutes;