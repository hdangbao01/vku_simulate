import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import { publicRoutes } from '~/routes';
import AuthProvider from './Context/AuthProvider';
import AppProvider from './Context/AppProvider';

function App() {
  return (
    <BrowserRouter>
      {/* <Router> */}
      <AuthProvider>
        <AppProvider>
          <Routes>
            {publicRoutes.map((route, i) => {
              const Page = route.component
              return <Route key={i} path={route.path} element={<Page />} />
            })}
          </Routes>
        </AppProvider>
      </AuthProvider>
      {/* </Router> */}
    </BrowserRouter>
  );
}

export default App;
