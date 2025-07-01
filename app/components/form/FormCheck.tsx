import React from "react";
import {
  Controller,
  FieldError,
  Merge,
  FieldErrorsImpl,
} from "react-hook-form";
import { Checkbox, FormControlLabel, FormHelperText } from "@mui/material";

interface IFormCheck {
  name: string;
  control: any;
  rules?: object;
  label: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
}

const FormCheck: React.FC<IFormCheck> = ({
  name,
  control,
  rules,
  label,
  error,
}) => {
  return (
    <div>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <FormControlLabel
            label={label}
            sx={error ? { color: "error.main" } : undefined}
            control={
              <Checkbox
                {...field}
                name={name}
                sx={error ? { color: "error.main" } : undefined}
                checked={field.value === true}
              />
            }
          />
        )}
      />
      {error && (
        <FormHelperText sx={{ color: "red" }} id={`${name}-error`}>
          {String(error?.message) || ""}
        </FormHelperText>
      )}
    </div>
  );
};

export default FormCheck;
