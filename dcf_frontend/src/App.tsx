import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

// Import your components
import FormPage from "./app/Form/page";
import Dashboard from "./app/dashboard/page";
import LoginView from "./app/auth/LoginView";
import RegisterView from "./app/auth/RegisterView";
import PrivateRoute from "./routes/components/PrivateRoutes";

// Import your Redux store
import store from "./store";

// Import styles
import "./index.css";
import Layout from "./app/layout/layout";
import SubmittedFormPage from "./app/submittedForm/page";
import NlpForm from "./app/nlpForm/page";

// Define the router
const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Layout>
          <Dashboard />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/create-forms",
    element: (
      <PrivateRoute>
        <Layout>
          <FormPage />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/submitted-forms",
    element: (
      <PrivateRoute>
        <Layout>
          <SubmittedFormPage />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/form-1",
    element: <NlpForm />,
  },
  {
    path: "/register",
    element: <RegisterView />,
  },
  {
    path: "/login",
    element: <LoginView />,
  },
]);

const App = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

export default App;
