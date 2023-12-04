import Home from '~/pages/Home';
import Campus from '~/pages/Campus';
import Room from '~/pages/Room';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/campus', component: Campus },
    { path: '/room', component: Room }
]

const privateRoutes = []

export { publicRoutes, privateRoutes }