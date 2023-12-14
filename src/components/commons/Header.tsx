/* eslint-disable sonarjs/cognitive-complexity */
import { Box, Grid } from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";
import pagopaLogo from "../../assets/images/pagopa-logo.svg";
import { Cart, PaymentInfo } from "../../features/payment/models/paymentModel";
import { CheckoutRoutes } from "../../routes/models/routeModel";
import {
  getSessionItem,
  SessionItems,
} from "../../utils/storage/sessionStorage";
import { paymentSubjectTransform } from "../../utils/transformers/paymentTransformers";

export default function Header() {
  const location = useLocation();
  const currentPath = location.pathname.split("/").slice(-1)[0];
  const paymentInfoData = getSessionItem(SessionItems.paymentInfo) as
    | PaymentInfo
    | undefined;
  const PaymentInfo = {
    receiver: paymentInfoData?.paName || "",
    subject: paymentSubjectTransform(paymentInfoData?.description) || "",
    amount: paymentInfoData?.amount || 0,
  };
  const CartInfo = getSessionItem(SessionItems.cart) as Cart | undefined;
  const ignoreRoutes: Array<string> = [
    CheckoutRoutes.ROOT,
    CheckoutRoutes.ERRORE,
    CheckoutRoutes.ESITO,
  ];

  return (
    <Box p={3} bgcolor={"white"}>
      <Grid container spacing={0}>
        <Grid item xs={2} display="flex" alignItems="center">
          <img
            src={pagopaLogo}
            alt="pagoPA"
            style={{ width: "56px", height: "36px" }}
            aria-hidden="true"
          />
        </Grid>
        {(!!PaymentInfo.receiver || !!CartInfo?.paymentNotices) &&
          !ignoreRoutes.includes(currentPath) && (
            <>
              <Grid
                item
                xs={10}
                display="flex"
                alignItems="center"
                justifyContent="flex-end"
                sx={{ cursor: "pointer" }}
              ></Grid>
            </>
          )}
      </Grid>
    </Box>
  );
}
