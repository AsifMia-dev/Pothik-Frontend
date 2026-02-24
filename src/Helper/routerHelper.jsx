import React from 'react'

/* ===================== PUBLIC PAGES ===================== */
import Homepage from "../pages/Homepage";
import DestinationExplorer from "../pages/DestinationExplorer";
import SpotDetails from "../pages/SpotDetails";
import Aboutpage from "../pages/Aboutpage";
import Blog from "../pages/Blog";
import BlogDetails from "../pages/BlogDetails";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Terms from "../pages/Terms";
import PrivacyPolicy from '../pages/PrivacyPolicy';
import PackageDetails from "../pages/user/PackageDetails";
import Packages from "../pages/user/Package";

/* ===================== USER PAGES ===================== */
import DashboardUser from "../pages/user/Profile";
import MyBookings from "../pages/user/BookingsHistory";
import CreatePackage from "../pages/user/CreatePackage";
import LoyaltyPoints from "../pages/user/LoyaltyPoints";
import BlogPost from "../pages/user/BlogPost";
import PaymentPage from "../pages/user/PaymentPage";
import CustomPackage from "../pages/user/CustomPackage";

/* ===================== OWNER PAGES ===================== */
import OwnerDashboard from "../pages/owner/Dashboard";

/* ===================== ADMIN PAGES ===================== */
import AdminDashboard from "../pages/admin/Dashboard";
import BlogManagement from "../pages/admin/BlogManagement";
import BookingManagement from "../pages/admin/BookingManagement";
import DestinationManagement from "../pages/admin/DestinationManagement";
import PackageManagement from "../pages/admin/PackageManagement";
import UserManagement from "../pages/admin/UserManagement";

/* ===================== ROUTE GUARD ===================== */
import PrivateRoute from "../routes/PrivateRoute";

/* ===================== ALL ROUTES ===================== */
export const allRoutes = [
  /* -------- Public -------- */
  { path: "/", element: Homepage, isPrivate: false },
  { path: "/destinations", element: DestinationExplorer, isPrivate: false },
  { path: "/destinations/:destinationId/spots", element: SpotDetails, isPrivate: false },
  { path: "/about", element: Aboutpage, isPrivate: false },
  { path: "/blog", element: Blog, isPrivate: false },
  { path: "/blogs/:slugOrId/blog", element: BlogDetails, isPrivate: false },
  { path: "/contact", element: Contact, isPrivate: false },
  { path: "/login", element: Login, isPrivate: false },
  { path: "/register", element: Register, isPrivate: false },
  { path: "/forgot-password", element: ForgotPassword, isPrivate: false },
  { path: "/terms", element: Terms, isPrivate: false },
  { path: "/privacy", element: PrivacyPolicy, isPrivate: false },
  { path: "/PackageDetails", element: PackageDetails, isPrivate: false },
  { path: "/packages", element: Packages, isPrivate: false },

  /* -------- User -------- */
  {
    path: "/user/profile",
    element: DashboardUser,
    isPrivate: true,
    role: "customer"
  },
  {
    path: "/user/bookings",
    element: MyBookings,
    isPrivate: true,
    role: "customer"
  },
  {
    path: "/user/create-package",
    element: CreatePackage,
    isPrivate: true,
    role: "customer"
  },
  {
    path: "/user/loyalty-points",
    element: LoyaltyPoints,
    isPrivate: true,
    role: "customer"
  },
  {
    path: "/user/package/:id",
    element: PackageDetails,
    isPrivate: true,
    role: "customer"
  },
  {
    path: "/user/blog-post",
    element: BlogPost,
    isPrivate: true,
    role: "customer"
  },
  {
    path: "/payment/:packageId",
    element: PaymentPage,
    isPrivate: true,
    role: "customer"
  },
  {
    path: "/custom-package",
    element: CustomPackage,
    isPrivate: false,
    role: "customer"
  },

  /* -------- Owner -------- */
  {
    path: "/owner/dashboard",
    element: OwnerDashboard,
    isPrivate: true,
    role: "owner"
  },

  /* -------- Admin -------- */
  {
    path: "/admin/dashboard",
    element: AdminDashboard,
    isPrivate: true,
    role: "admin",
  },
  {
    path: "/admin/blogs",
    element: BlogManagement,
    isPrivate: true,
    role: "admin",
  },
  {
    path: "/admin/bookings",
    element: BookingManagement,
    isPrivate: true,
    role: "admin",
  },
  {
    path: "/admin/destinations",
    element: DestinationManagement,
    isPrivate: true,
    role: "admin",
  },
  {
    path: "/admin/packages",
    element: PackageManagement,
    isPrivate: true,
    role: "admin",
  },
  {
    path: "/admin/users",
    element: UserManagement,
    isPrivate: true,
    role: "admin",
  },
];

export const renderRouterElement = (route) => {
  const Component = route.element;
  if (route.isPrivate) {
    return (
      <PrivateRoute role={route.role}>
        <Component />
      </PrivateRoute>
    )
  }
  return <Component />;
}
