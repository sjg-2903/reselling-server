import React from "react";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Dashboard from "./Components/Dashboard/Dashboard";
import {createBrowserRouter,RouterProvider} from'react-router-dom'
import Company from "./Components/Dashboard/Company";
import Segment from "./Components/Dashboard/Segment";
import NewsPanel from "./Components/Dashboard/NewsPanel";
import AnalyticsPanel from "./Components/Dashboard/AnalyticsPanel";
import CouponsPanel from "./Components/Dashboard/CouponsPanel";
import NContent from "./Components/Dashboard/NContent";
import AContent from "./Components/Dashboard/AContent";
import CContent from "./Components/Dashboard/CContent";
import AmazonPanel from "./Components/Dashboard/AmazonPanel";
import ACPanel from "./Components/Dashboard/ACPanel";
import LegoPanel from "./Components/Dashboard/LegoPanel";
import LPanel from "./Components/Dashboard/LPanel";

const router = createBrowserRouter([
  {
    path: '/',
    element:<div><Login/></div>
  },
  {
    path: '/register',
    element:<div><Register/></div>
  },
  {
    path: '/dashboard',
    element:<div><Dashboard/></div>
  },
  {
    path: '/company',
    element:<div><Company/></div>
  },
  {
    path: '/segment',
    element:<div><Segment/></div>
  },
  {
    path: '/news',
    element:<div><NewsPanel/></div>
  },
  {
    path: '/analytics',
    element:<div><AnalyticsPanel/></div>
  },
  {
    path: '/coupons',
    element:<div><CouponsPanel/></div>
  },
  {
    path: '/newscontent',
    element:<div><NContent/></div>
  },
  {
    path: '/analyticscontent',
    element:<div><AContent/></div>
  },
  {
    path: '/couponscontent',
    element:<div><CContent/></div>
  },
  {
    path: '/amazon',
    element:<div><AmazonPanel/></div>
  },
  {
    path: '/amazoncontent',
    element:<div><ACPanel/></div>
  },
  {
    path: '/lego',
    element:<div><LegoPanel/></div>
  },
  {
    path: '/legocontent',
    element:<div><LPanel/></div>
  },


])

function App(){
  return(
    <RouterProvider router={router}/>
  )
}
export default App;