import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "./layouts/public";
import HomePublicPage from "./pages/public/home";
import ErrorPage from "./pages/public/error";
import SignUpPage from "./pages/public/signup";
import PlayGroundElementLayout from "./layouts/playground";
import PlayGroundHome from "./pages/playground/home";
import LoginPage from "./pages/public/login";

const Router = createBrowserRouter([
    {
        path: "/",
        errorElement: <ErrorPage />,
        element: <PublicLayout />,
        children: [
            { path: "/", element: <HomePublicPage /> },
            { path: "/signup", element: <SignUpPage /> },
            { path: "/login", element: <LoginPage /> },
        ]
    },
    {
        path: "/playground",
        errorElement: <ErrorPage />,
        element: <PlayGroundElementLayout />,
        children: [
            { path: "home", element: <PlayGroundHome /> },
        ]
    },


])
export default Router;   