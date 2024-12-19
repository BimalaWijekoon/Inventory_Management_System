import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import RootComponent from "./components/RootComponent";
import Home from "./components/bodyComponents/Home/Home";
import Inventory from "./components/bodyComponents/inventory/Inventory";
import Customer from "./components/bodyComponents/customer/Customer";
import Revenue from "./components/bodyComponents/revenue/Revenue";
import Growth from "./components/bodyComponents/growth/Growth";
import Setting from "./components/bodyComponents/Settings/Setting";
import Order from "./components/bodyComponents/order/Order";
import AddProduct from "./components/bodyComponents/inventory/add-product";
import AddOrder from "./components/bodyComponents/order/addorder"; // Ensure AddOrder is correctly imported
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import Inter from "../public/static/fonts/Inter.ttf"; // Ensure this path is correct

function App() {
  const theme = createTheme({
    spacing: 4,
    palette: {
      mode: "light",
    },
    typography: {
      fontFamily: "Inter", // You already defined the custom font here
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @font-face {
            font-family: 'Inter';
            font-style: normal;
            font-display: swap;
            font-weight: 400;
            src: local('Inter'), url(${Inter}) format('truetype');
          }
        `,
      },
    },
  });

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootComponent />}>
        <Route index element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/customers" element={<Customer />} />
        <Route path="/revenue" element={<Revenue />} />
        <Route path="/growth" element={<Growth />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/add-product" element={<AddProduct />} /> {/* Add Product route */}
        <Route path="/addorder" element={<AddOrder />} /> {/* Add Order route */}
      </Route>
    )
  );

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
      <CssBaseline />
    </ThemeProvider>
  );
}

export default App;
