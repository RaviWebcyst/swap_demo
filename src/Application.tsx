import React from "react";
import { Navigate, Router, RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { ROUTES } from "./utils/constants";
import PageNotFound from "./components/pages/PageNotFound/PageNotFound";
import Errorpage from "./components/pages/ErrorPage/Errorpage";

// Update the import path to the correct location of the PancakeSwap component
import PancakeSwap from "./components/pages/PanCakeSwap/Swap";
import PancakeSwapCard from "./components/pages/PanCakeSwap/SwapCard/SwapCard";
import PancakeReviewSwap from "./components/pages/PanCakeSwap/ReviewSwap/ReviewSwap"


const Application = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      ErrorBoundary: Errorpage,
      element: <Layout />,
      children: [
   
        {
          path: ROUTES.HOME,
          // element: <PancakeSwap/>,
          element: <Navigate to={ROUTES.SWAP} replace />,
        },
        
        {
          path: ROUTES.SWAP,
          // index: true,
          element: <PancakeSwap />,
          children: [
            {
              index: true,
              element: <PancakeSwapCard />,
            },
            {
              path: ROUTES.REVIEWSWAP,
              element: <PancakeReviewSwap />,
            },
          ],
        },
    
      ],
    },
    {
      path: "*",
      element: <PageNotFound />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default Application;
