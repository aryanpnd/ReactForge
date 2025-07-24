import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AuthPage from './pages/auth/Login.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)