import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import { publicRoutes } from '~/routes';
import AuthProvider from './Context/AuthProvider';
import AppProvider from './Context/AppProvider';

function App() {
  return (
    <BrowserRouter>
      {/* <Router> */}
      <Routes>
        {publicRoutes.map((route, i) => {
          const Page = route.component
          return <Route key={i} path={route.path} element={
            route.auth ?
              <AuthProvider>
                <AppProvider>
                  <Page />
                </AppProvider>
              </AuthProvider>
              : <Page />
          } />
        })}
      </Routes>
      {/* </Router> */}
    </BrowserRouter>
  );
}

export default App;
