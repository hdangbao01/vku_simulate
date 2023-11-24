import Home from '~/pages/Home';
import Room from '~/pages/Room';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/room', component: Room }
]

const privateRoutes = []

export { publicRoutes, privateRoutes }