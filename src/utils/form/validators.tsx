import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import React from "react";

export const getFormValidationIcon = (
  touched: boolean | undefined,
  error: boolean | undefined
) =>
  touched ? (
    error ? (
      <Close sx={{ mr: 1 }} color="error" />
    ) : (
      <Check sx={{ mr: 1, color: "green" }} />
    )
  ) : undefined;

export const getFormErrorIcon = (
  touched: boolean | undefined,
  error: boolean | undefined
) => {
  if (touched && error) {
    return <ErrorOutlineIcon sx={{ mr: 1 }} color="error" />;
  }
  return undefined;
};
