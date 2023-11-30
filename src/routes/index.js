import Home from '~/pages/Home';
import Campus from '~/pages/Campus';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/campus', component: Campus }
]

const privateRoutes = []

export { publicRoutes, privateRoutes }