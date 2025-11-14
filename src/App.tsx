import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import { routes } from './routes/config';
import Layout from './components/layout/Layout'; // Import the single Layout

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
                  route.requireAuth ? (
                    <ProtectedRoute requireAuth={route.requireAuth}>
                      <Layout>
                        <RouteComponent />
                      </Layout>
                    </ProtectedRoute>
                  ) : (
                    // Public routes don't get the layout
                    <RouteComponent />
                  )
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