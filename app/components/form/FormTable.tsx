// import React, { forwardRef, useState, useEffect, useCallback, useMemo } from "react";
// import { useForm, useFieldArray, useFormContext } from "react-hook-form";
// import {
//   TextField,
//   Button,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   IconButton,
//   styled,
//   tableCellClasses,
//   FormControl,
//   Typography,
//   Grid,
//   TextFieldProps,
// } from "@mui/material";
// import { Add, Delete } from "@mui/icons-material";
// import { DatePicker } from "@mui/x-date-pickers";
// import FormCheck from "./FormCheck";
// import { parseISO } from "date-fns";
// import { useTranslations } from "next-intl";

// interface CustomInputProps extends Omit<TextFieldProps, 'ref'> {
//   [key: string]: any;
// }

// const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>((props, ref) => {
//   return (
//     <TextField
//       fullWidth
//       {...props}
//       inputRef={ref}
//       autoComplete="off"
//     />
//   );
// });
// CustomInput.displayName = "CustomInput";

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: theme.palette.common.backgroundChannel,
//     color: theme.palette.common.black,
//     fontWeight: 800,
//     fontSize: 16,
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//   },
// }));

// // ✅ TIMEZONE-SAFE UTILITIES - These fix the timezone issues
// const dateToLocalDateString = (date: Date): string => {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// };

// const parseLocalDate = (dateString: string): Date | null => {
//   if (!dateString) return null;
  
//   // If it's a simple YYYY-MM-DD format, parse as local date
//   if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
//     const [year, month, day] = dateString.split('-').map(Number);
//     return new Date(year, month - 1, day);
//   }
  
//   // If it's an ISO string, extract just the date part
//   if (dateString.includes('T')) {
//     const datePart = dateString.split('T')[0];
//     const [year, month, day] = datePart.split('-').map(Number);
//     return new Date(year, month - 1, day);
//   }
  
//   // Fallback to parseISO for other formats
//   try {
//     return parseISO(dateString);
//   } catch {
//     return null;
//   }
// };

// interface TableFormFieldProps {
//   formName: string;
//   name: string;
//   columns?: any[];
// }

// function TableFormField({ formName, name, columns = [] }: TableFormFieldProps) {
//   const {
//     register,
//     control,
//     watch,
//     setValue,
//     formState: { errors },
//   } = useFormContext<any>();

//   const values = watch();
//   const t = useTranslations("Index");
//   const [rowCount, setRowCount] = useState<number>(0);

//   // ✅ FIXED: This is the main fix - timezone-safe date handling
//   const handleDateChange = useCallback((date: Date | null, fieldName: string): void => {
//     if (date) {
//       // Store as YYYY-MM-DD string instead of ISO string
//       // This prevents timezone conversion issues
//       const dateString = dateToLocalDateString(date);
//       setValue(fieldName, dateString);
//     } else {
//       setValue(fieldName, null);
//     }
//   }, [setValue]);

//   // ✅ FIXED: Timezone-safe date parsing for display
//   const getDateValue = useCallback((formName: string, name: string, index: number): Date | null => {
//     const dateValue = values?.[formName]?.[name]?.[index]?.date;
//     return dateValue ? parseLocalDate(dateValue) : null;
//   }, [values]);

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: `${formName}.${name}`,
//   });

//   // Memoize handlers for better performance
//   const handleRemoveRow = useCallback((index: number): void => {
//     remove(index);
//     setRowCount(prev => prev - 1);
//   }, [remove]);

//   const handleAddRow = useCallback((): void => {
//     append({});
//     setRowCount(prev => prev + 1);
//   }, [append]);

//   return (
//     <Table sx={{ mt: -2 }}>
//       <TableBody>
//         {fields.map((row: any, index) => (
//           <TableRow key={row.id}>
//             <Grid
//               container
//               spacing={2}
//               sx={{ p: 1 }}
//             >
//               {/* Main input field */}
//               <Grid item xs={12} sm={formName === "medical_history" ? 7 : 10}>
//                 <TextField
//                   {...register(`${formName}.${name}.${index}.value`)}
//                   fullWidth
//                   id={`${index}`}
//                   sx={{ p: 0 }}
//                   placeholder={
//                     formName === "medical_history" 
//                       ? t("medicalHistorySurgeryOrProcedure") || "Enter surgery or procedure"
//                       : t("enterValue") || "Enter value"
//                   }
//                   // error={!!errors?.[formName]?.[name]?.[index]?.value}
//                   // helperText={errors?.[formName]?.[name]?.[index]?.value?.message}
//                 />
//               </Grid>
              
//               {/* Date picker - only for medical history */}
//               {formName === "medical_history" && (
//                 <Grid item xs={10} sm={4}>
//                   <FormControl fullWidth>
//                     <DatePicker
//                       disableFuture
//                       // ✅ FIXED: Use timezone-safe date parsing
//                       value={getDateValue(formName, name, index)}
//                       // ✅ FIXED: Use timezone-safe date handling
//                       onChange={(date) =>
//                         handleDateChange(date, `${formName}.${name}.${index}.date`)
//                       }
//                       slotProps={{
//                         textField: {
//                           placeholder: t("selectDate") || "Select date",
//                           size: "small",
//                           // error: !!errors?.[formName]?.[name]?.[index]?.date,
//                           // helperText: errors?.[formName]?.[name]?.[index]?.date?.message
//                         }
//                       }}
//                     />
//                   </FormControl>
//                 </Grid>
//               )}
              
//               {/* Delete button */}
//               <Grid
//                 item
//                 xs={1}
//                 style={{ display: "flex", alignItems: "center" }}
//               >
//                 <IconButton
//                   onClick={() => handleRemoveRow(index)}
//                   color="error"
//                   size="small"
//                   title={t("deleteRow") || "Delete row"}
//                 >
//                   <Delete />
//                 </IconButton>
//               </Grid>
//             </Grid>

//             {/* Additional fields for surgery procedures */}
//             {values?.[formName]?.[name]?.[index]?.value &&
//               (name === "surgery_or_procedure" || name === "surgery_or_proceducre") && (
//                 <Grid
//                   container
//                   sx={{
//                     p: 1,
//                     display: { xs: "flex" },
//                     flexDirection: {
//                       xs: "column",
//                       sm: "row",
//                     },
//                     alignItems: "center",
//                   }}
//                 >
//                   <Grid item sm={4} xs={12} style={{ marginLeft: 20 }}>
//                     <FormCheck
//                       name={`${formName}.${name}.${index}.metal_in_body`}
//                       control={control}
//                       label={t("metalInBodyQuestion") || "Is there metal in your body"}
//                       // error={errors?.[formName]?.[name]?.[index]?.metal_in_body}
//                     />
//                   </Grid>
                  
//                   {values?.[formName]?.[name]?.[index]?.metal_in_body && (
//                     <Grid item sm={4} xs={12}>
//                       <TextField
//                         label={t("listMetalLocation") || "List where"}
//                         fullWidth
//                         size="small"
//                         {...register(
//                           `${formName}.${name}.${index}.list_of_metal_in_body`
//                         )}
//                         // error={!!errors?.[formName]?.[name]?.[index]?.list_of_metal_in_body}
//                         // helperText={
//                         //   errors?.[formName]?.[name]?.[index]?.list_of_metal_in_body?.message
//                         // }
//                       />
//                     </Grid>
//                   )}
//                 </Grid>
//             )}
//           </TableRow>
//         ))}
        
//         {/* Add new row button */}
//         {rowCount < 8 && (
//           <TableRow>
//             <StyledTableCell>
//               <IconButton 
//                 onClick={handleAddRow} 
//                 color="primary"
//                 title={t("medicalHistoryAddRow") || "Add row"}
//               >
//                 <Add />
//                 <Typography color="primary" sx={{ ml: 1 }}>
//                   {t("medicalHistoryAddRow") || "Add Row"}
//                 </Typography>
//               </IconButton>
//             </StyledTableCell>
//           </TableRow>
//         )}
//       </TableBody>
//     </Table>
//   );
// };

// export default TableFormField;

import React, { forwardRef, useState, useEffect } from "react";

import { useForm, useFieldArray, useFormContext } from "react-hook-form";
import {
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  styled,
  tableCellClasses,
  FormControl,
  Typography,
  Grid,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import FormCheck from "./FormCheck";
import { parseISO } from "date-fns";
import { useTranslations } from "next-intl";

const CustomInput = forwardRef((props, ref) => {
  return (
    <TextField
      fullWidth
      {...props}
      inputRef={ref}
      // label="Birth Date"
      autoComplete="off"
    />
  );
});
CustomInput.displayName = "CustomImput";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.backgroundChannel,
    color: theme.palette.common.black,
    fontWeight: 800,
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
function TableFormField({ formName, name, columns = [] }: any) {
  const {
    handleSubmit,
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const values = watch();
  const t = useTranslations("Index");

  const [rowCount, setRowCount] = useState(0);
  const handleDateChange = (date: Date | null, name: string) => {
    if (date) setValue(name, date?.toISOString());
  };
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${formName}.${name}`,
  });
  // useEffect(() => {
  //   if (!fields.length) append({});
  // }, []);

  return (
    <Table sx={{ mt: -2 }}>
      <TableBody>
        {fields.map((row: any, index) => (
          <TableRow key={row.id}>
            <Grid
              container
              spacing={2}
              sx={{
                p: 1,
              }}
            >
              <Grid item xs={12} sm={formName === "medical_history" ? 7 : 10}>
                <TextField
                  {...register(`${formName}.${name}.${index}.value`)}
                  fullWidth
                  id={`${index}`}
                  sx={{ p: 0 }}
                />
              </Grid>
              {formName === "medical_history" && (
                <Grid item xs={10} sm={4}>
                  <FormControl fullWidth>
                    <DatePicker
                      disableFuture
                      value={
                        values?.[formName]?.[name]?.[index]?.date
                          ? parseISO(values?.[formName]?.[name]?.[index]?.date)
                          : null
                      }
                      // {...register(`${formName}.${name}.${index}.date`)}
                      onChange={(date) =>
                        handleDateChange(
                          date,
                          `${formName}.${name}.${index}.date`
                        )
                      }
                    />
                  </FormControl>
                </Grid>
              )}
              <Grid
                item
                xs={1}
                style={{ display: "flex", alignItems: "center" }}
              >
                <IconButton
                  onClick={() => {
                    remove(index);
                    setRowCount(() => rowCount - 1);
                  }}
                >
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
            {values?.[formName]?.[name]?.[index]?.value &&
              name === "surgery_or_proceducre" && (
                <>
                  <Grid
                    container
                    sx={{
                      p: 1,
                      display: { xs: "flex" },
                      flexDirection: {
                        xs: "column",
                        sm: "row",
                        alignItems: "center",
                      },
                    }}
                  >
                    <Grid item sm={4} xs={12} style={{ marginLeft: 20 }}>
                      <FormCheck
                        name={`${formName}.${name}.${index}.metal_in_body`}
                        control={control}
                        // rules={}
                        label={"Is there metal in your body"}
                        // @ts-ignore
                        error={""}
                      />
                    </Grid>
                    {values?.[formName]?.[name]?.[index]?.metal_in_body && (
                      <Grid item sm={4} xs={12}>
                        <TextField
                          label="List where"
                          fullWidth
                          {...register(
                            `${formName}.${name}.${index}.list_of_metal_in_body`
                          )}
                        />
                      </Grid>
                    )}
                  </Grid>
                </>
              )}
          </TableRow>
        ))}
        {rowCount < 8 && (
          <TableRow>
            <StyledTableCell>
              <IconButton
                onClick={() => {
                  append({});
                  setRowCount(() => rowCount + 1);
                }}
              >
                <Add color="primary" />
                <Typography color={"primary"}>
                  {t("medicalHistoryAddRow")}
                </Typography>
              </IconButton>
            </StyledTableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default TableFormField;
