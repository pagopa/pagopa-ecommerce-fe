import { createTheme, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "@pagopa/mui-italia";
import React from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PaymentResponsePageV2 from "routes/PaymentResponsePageV2";
import { SessionItems } from "utils/storage/sessionStorage";
import Guard from "components/commons/Guard";
import { EcommerceRoutes } from "./routes/models/routeModel";
import PaymentResponsePage from "./routes/PaymentResponsePage";
import GdiCheckPage from "./routes/GdiCheckPage";
import "./translations/i18n";

const checkoutTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    background: {
      paper: theme.palette.background.default,
      default: theme.palette.background.paper,
    },
  },
  components: {
    ...theme.components,
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginTop: 0,
          height: 0,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        message: {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      },
    },
  },
});

export function App() {
  const { t } = useTranslation();
  // eslint-disable-next-line functional/immutable-data
  document.title = t("app.title");

  return (
    <ThemeProvider theme={checkoutTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path={EcommerceRoutes.ROOT}>
            <Route path="" element={<Navigate to={EcommerceRoutes.ESITO} />} />
            <Route
              path={EcommerceRoutes.GDI_CHECK}
              element={<GdiCheckPage />}
            />
            <Route
              path={EcommerceRoutes.ESITO}
              element={<PaymentResponsePage />}
            />
            <Route
              path={`v2/${EcommerceRoutes.ESITO}`}
              element={
                <Guard item={SessionItems.transaction}>
                  <PaymentResponsePageV2 />
                </Guard>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
