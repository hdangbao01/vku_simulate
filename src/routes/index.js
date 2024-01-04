import Home from '~/pages/Home';
import Campus from '~/pages/Campus';
import Room from '~/pages/Room';
import Round from '~/pages/Round';
import Meeting from '~/pages/Meeting';
import Login from '~/pages/Login';
import Design from '~/pages/Design';
import Admin from '~/pages/Admin';
import RoomCall from '~/components/RoomCall';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/campus', component: Campus },
    { path: '/room', component: Room },
    { path: '/round', component: Round },
    { path: '/design', component: Design },
    { path: '/meeting', component: Meeting, auth: true },
    { path: '/login', component: Login, auth: true },
    { path: '/admin', component: Admin, socket: true },
    { path: '/call/:roomId', component: RoomCall, socket: true }
]

const privateRoutes = []

export { publicRoutes, privateRoutes }