import Home from '~/pages/Home';
import Campus from '~/pages/Campus';
import Room from '~/pages/Room';
import Meeting from '~/pages/Meeting';
import Login from '~/pages/Login';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/campus', component: Campus },
    { path: '/room', component: Room },
    { path: '/meeting', component: Meeting, auth: true },
    { path: '/login', component: Login, auth: true }
]

const privateRoutes = []

export { publicRoutes, privateRoutes }