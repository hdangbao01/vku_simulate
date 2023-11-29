import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from '~/routes';

function App() {
  return (
    <Router>
      <Routes>
        {publicRoutes.map((route, i) => {
          const Page = route.component
          return <Route key={i} path={route.path} element={<Page />} />
        })}
      </Routes>
    </Router>
  );
}

export default App;
