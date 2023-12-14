import { Box } from "@mui/material";
import { CSSProperties } from "@mui/material/styles/createTypography";
import React from "react";

export default function PageContainer(props: {
  children?: React.ReactNode;
  childrenSx?: CSSProperties;
}) {
  return (
    <Box mt={3} mb={6} aria-live="polite">
      <Box sx={props.childrenSx}>{props.children}</Box>
    </Box>
  );
}
