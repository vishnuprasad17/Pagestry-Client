import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/Home";
import Register from "../components/Register";
import Login from "../components/Login";
import Cart from "../pages/books/Cart";
import Wishlist from "../pages/books/Wishlist";
import SingleBook from "../pages/books/SingleBook";
import PrivateRoute from "./PrivateRoute";
import OrdersPage from "../pages/orders/OrdersPage";
import OrderDetails from "../pages/orders/OrderDetails";
import AdminLogin from "../components/AdminLogin";
import AdminRoute from "./AdminRoute";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import AddBook from "../pages/dashboard/books/AddBook";
import UpdateBook from "../pages/dashboard/books/UpdateBook";
import ManageBooks from "../pages/dashboard/books/ManageBooks";
import UserDashboard from "../pages/users/UserDashboard";
import RouteErrorPage from "../pages/RouteErrorPage";
import Books from "../pages/books/Books";
import Category from "../pages/dashboard/categories/Category";
import AddAuthor from "../pages/dashboard/authors/AddAuthor";
import ManageAuthors from "../pages/dashboard/authors/ManageAuthors";
import Author from "../pages/dashboard/authors/Author";
import AddBanner from "../pages/dashboard/banners/AddBanner";
import ManageBanners from "../pages/dashboard/banners/ManageBanners";
import Address from "../pages/users/address/Address";
import EditAddress from "../pages/users/address/EditAddress";
import UserProfile from "../pages/users/Profile";
import AddAddress from "../pages/users/address/AddAddress";
import Checkout from "../pages/checkout/Checkout";
import CheckoutPage from "../pages/checkout/CheckoutPage";
import AddressList from "../pages/checkout/address-section/AddressList";
import ManageUsers from "../pages/dashboard/users/ManageUsers";
import AuditLog from "../pages/dashboard/users/AuditLog";
import EditProfile from "../pages/users/EditProfile";
import ChangePassword from "../pages/users/ChangePassword";
import ForgotPassword from "../components/ForgotPassword";
import PaymentVerification from "../pages/checkout/PaymentVerificationPage";
import AuthorDetailPage from "../pages/books/AuthorDetails";
import Orders from "../pages/dashboard/orders/Orders";
import OrderDetail from "../pages/dashboard/orders/OrderDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: < RouteErrorPage />,
    children: [
        {
            path: "/",
            element: <Home/>,
        },
        {
          path: "/books",
          element: <Books/>
        },
        {
            path: "/about",
            element: <h1>About</h1>,
        },
        {
          path: "/login",
          element: <Login/>
        },
        {
          path: "/forgot-password",
          element: <ForgotPassword/>
        },
        {
          path: "/register",
          element: <Register/>
        },
        {
          path: "/cart",
          element: <Cart/>
        },
        {
          path: "/wishlist",
          element: <PrivateRoute><Wishlist/></PrivateRoute>
        },
        {
          path: "/books/:id",
          element: <SingleBook/>
        },
        {
          path: "/author/:id",
          element: <AuthorDetailPage/>
        },
        {
          path: "/user-dashboard",
          element: (
            <PrivateRoute>
            <UserDashboard />
            </PrivateRoute>
          ),
          children: [
            {
              index: true,
              element: <UserProfile />
            },
            {
              path: "orders",
              element: <OrdersPage />
            },
            {
              path: "orders/:id",
              element: <OrderDetails />
            },
            {
              path: "address",
              element: <Address />
            },
            {
              path: "address/add-address",
              element: <AddAddress />
            },
            {
              path: "address/edit/:id",
              element: <EditAddress />
            },
            {
              path: "edit-profile",
              element: <EditProfile />
            },
            {
              path: "change-password",
              element: <ChangePassword />
            }
          ]
        },
        {
          path: "/checkout",
          element: (
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          ),
          children: [
            {
              index: true,
              element: <CheckoutPage />
            },
            {
              path: "address",
              element: < AddressList />
            },
            {
              path: "payment/verify",
              element: <PaymentVerification />
            }
          ]
        }

    ]
  },
  {
    path: "/admin/login",
    element: <AdminLogin/>
  },
  {
    path: "admin/dashboard",
    element: <AdminRoute>
          <DashboardLayout/>
            </AdminRoute>,
    errorElement: < RouteErrorPage />,
    children:[
        {
          index: true,
          element: <Dashboard/>
        },
        {
          path: "categories",
          element: <Category/>
        },
        {
          path: "manage-users",
          element: <ManageUsers/>
        },
        {
          path: "audit-log",
          element: <AuditLog/>
        },
        {
          path: "add-new-banner",
          element: <AddBanner/>
        },
        {
          path: "manage-banners",
          element: <ManageBanners/>
        },
        {
          path: "orders",
          element: <Orders/>
        },
        {
          path: "orders/:id",
          element: <OrderDetail/>
        },
        {
          path: "add-new-book",
          element: <AddBook/>
        },
        {
          path: "edit-book/:id",
          element: <UpdateBook/>
        },
        {
          path: "manage-books",
          element: <ManageBooks/>
        },
        {
          path: "add-new-author",
          element: <AddAuthor/>
        },
        {
          path: "manage-authors",
          element: <ManageAuthors/>
        },
        {
          path: "manage-authors/:id",
          element: <Author/>
        }
        
      ]
  }
]);

export default router;