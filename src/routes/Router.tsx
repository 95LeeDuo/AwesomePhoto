import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Frame from "@/pages/Frame";
import SelectLocation from "@/pages/SelectLocation";
import SelectImage from "@/pages/SelectImage";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import OAuth from "@/pages/OAuth";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/OAuth",
    element: <OAuth />,
  },
  {
    path: "/frame",
    element: <Frame />,
  },
  {
    path: "/selectImage",
    element: <SelectImage />,
  },
  {
    path: "/select-location",
    element: <SelectLocation />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}