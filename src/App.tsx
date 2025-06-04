import './App.css'
import { ThemeProvider } from '@/components/theme-provider'
import Homepage from './pages/Homepage'
import Formpage from './pages/Formpage'
import { createBrowserRouter,RouterProvider } from "react-router"

function App() {

  const router=createBrowserRouter(
    [
      {
          path:"/home",
          element:
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Homepage/>
          </ThemeProvider>
      },
      {
        path:"/form",
        element:
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Formpage/>
          </ThemeProvider>
      },
      {
        path:"*",
        element:
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Homepage/>
          </ThemeProvider>
      }
    ]
  );

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
