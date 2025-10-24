import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import { routes } from './routes/config';

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <Routes>
          {routes.map((route, index) => {
            const RouteComponent = route.component;
            
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <ProtectedRoute requireAuth={route.requireAuth}>
                    <RouteComponent />
                  </ProtectedRoute>
                }
              />
            );
          })}
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;