import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import { Trans } from "react-i18next";
import { SessionItems, setSessionItem } from "../utils/storage/sessionStorage";
import { getFragments } from "../utils/urlUtilities";
import PageContainer from "../components/PageContainer";
import IframeCardForm from "../features/payment/components/IframeCardForm/IframeCardForm";
import InformationModal from "../components/modals/InformationModal";
import { ROUTE_FRAGMENT } from "./models/routeModel";

export default function IFrameCardPage() {
  const navigate = useNavigate();
  const [loading] = React.useState(false);
  const [cvvModalOpen, setCvvModalOpen] = React.useState(false);
  const handleClose = () => setCvvModalOpen(false);
  const theme = useTheme();
  const onCancel = () => navigate(-1);

  React.useEffect(() => {
    const { sessionToken, clientId, paymentMethodId, rptId, amount } =
      getFragments(
        ROUTE_FRAGMENT.SESSION_TOKEN,
        ROUTE_FRAGMENT.CLIENT_ID,
        ROUTE_FRAGMENT.PAYMENT_METHOD_ID,
        ROUTE_FRAGMENT.RPT_ID,
        ROUTE_FRAGMENT.AMOUNT
      );

    if(sessionToken != "") {
      setSessionItem(SessionItems.sessionToken, sessionToken);
    }
    if(clientId != "") {
      setSessionItem(SessionItems.clientId, clientId);
    }
    if(paymentMethodId != "") {
      setSessionItem(SessionItems.paymentMethodId, paymentMethodId);
    }
    if(rptId != "") {
      setSessionItem(SessionItems.rptId, rptId);
    }
    if(amount != "") {
      setSessionItem(SessionItems.amount, amount);
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100vh",
        bgcolor: theme.palette.background.default,
      }}
    >
      <Container
        id="main_content"
        component="main"
        tabIndex={-1}
        sx={{
          p: { xs: 0 },
          pl: { xs: 3, sm: 6, md: 0 },
          pr: { xs: 3, sm: 6, md: 0 },
          flexGrow: 1,
        }}
        maxWidth={"sm"}
      >
        <PageContainer title="inputCardPage.title">
          <Button
            data-testid="helpLink"
            id={"helpLink"}
            variant="text"
            onClick={() => setCvvModalOpen(true)}
            sx={{ p: 0, height: "auto", minHeight: "auto" }}
          >
            {t("iframeCardPage.helpLink")}
          </Button>
          <Box sx={{ mt: 4 }}>
            <IframeCardForm onCancel={onCancel} loading={loading} />
          </Box>
          <InformationModal
            open={cvvModalOpen}
            onClose={handleClose}
            maxWidth="sm"
            hideIcon={true}
          >
            <Typography
              data-testid="modalTitle"
              variant="h6"
              component={"div"}
              sx={{ pb: 2 }}
            >
              {t("iframeCardPage.modalTitle")}
            </Typography>
            <Box sx={{ mt: -1 }}>
              <Typography
                variant="body1"
                component={"div"}
                sx={{
                  "& ul": {
                    listStyleType: "none",
                    paddingLeft: 0,
                    marginTop: 2,
                    marginBottom: 0,
                  },
                  "& li": {
                    display: "flex",
                    marginBottom: 1,
                  },
                  "& li.second": {
                    marginTop: 0,
                  },
                  "& li .bullet": {
                    minWidth: "24px",
                  },
                  "& p:first-of-type": {
                    marginTop: 0,
                  },
                }}
              >
                <Trans i18nKey="iframeCardPage.modalBodyText">
                  Default text <br /> Fallback
                </Trans>
              </Typography>
              <Box display="flex" justifyContent="flex-end" sx={{ mt: 3 }}>
                <Button
                  data-testid="closeButton"
                  variant="contained"
                  onClick={handleClose}
                >
                  {t("iframeCardPage.buttonClose")}
                </Button>
              </Box>
            </Box>
          </InformationModal>
        </PageContainer>
      </Container>
    </Box>
  );
}
