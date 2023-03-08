import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./Main";
import HomePage, { loader as articlesLoader } from "./pages/Home";

import ErrorPage from "./pages/Error";

const router = createBrowserRouter([
  // Since we want navbar on all pages, we define
  // all routes to render next to (under) this component.
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, 
        element: <HomePage />, 
        loader: articlesLoader 
      },
      {
        path: "articles/:id",
        id: "article-detail",
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
