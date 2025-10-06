import { Box, Typography } from "@mui/material";
import { CSSProperties } from "@mui/material/styles/createTypography";
import React from "react";

export default function PageContainer(props: {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  link?: React.ReactNode;
  childrenSx?: CSSProperties;
}) {
  const { title, description, link, children, childrenSx } = props;

  const Content = () => (
    <>
      {!!title && (
        <Typography
          variant="h4"
          component={"div"}
          mb={2}
          mt={3}
          color="text.primary"
        >
          {props.title}
        </Typography>
      )}

      {(description || link) && (
        <Typography
          variant="body2"
          sx={{ mb: 1 }}
          color="text.light"
          whiteSpace="pre-line"
        >
          {!!description && description}
          {!!link && link}
        </Typography>
      )}
      <Box sx={childrenSx}>{children}</Box>
    </>
  );

  return (
    <Box mt={3} mb={6} aria-live="polite">
      <Content />
    </Box>
  );
}
