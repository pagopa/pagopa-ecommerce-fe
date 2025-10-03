import { Box, Typography } from "@mui/material";
import { CSSProperties } from "@mui/material/styles/createTypography";
import React from "react";
import { useTranslation } from "react-i18next";

export default function PageContainer(props: {
  title?: string;
  children?: React.ReactNode;
  childrenSx?: CSSProperties;
}) {
  const { t } = useTranslation();
  return (
    <Box mt={3} mb={6} aria-live="polite">
      {!!props.title && (
        <Typography variant="h4" component={"div"}>
          {t(props.title)}
        </Typography>
      )}
      <Box sx={props.childrenSx}>{props.children}</Box>
    </Box>
  );
}