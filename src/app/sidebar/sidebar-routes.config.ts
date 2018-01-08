import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard', icon: 'material-icons' },
    
    { path: '/my-websites', title: 'My Websites', icon: 'material-icons' },
    { path: '/my-websites/add', title: 'Add new Website', icon: 'material-icons' },
    { path: '/my-websites/list', title: 'My Websites', icon: 'material-icons' },
    
    { path: '/components/checktechnology', title: 'Check Technology (Beta)', icon:'pe-7s-plugin' },
    { path: '/components/consult2implement', title: 'Consult 2 Implement', icon:'pe-7s-plugin' },

    { path: '/agents', title: 'Agents', icon:'material-icons' },
    { path: '/agents/manage', title: 'Manage', icon:'material-icons' },
    { path: '/agents/workinghours', title: 'Working Hours', icon:'material-icons' },
    
];
