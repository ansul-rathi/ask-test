// import React from "react";
// import {
//   Controller,
//   FieldError,
//   Merge,
//   FieldErrorsImpl,
// } from "react-hook-form";
// import {
//   FormHelperText,
//   MenuItem,
//   TextField,
// } from "@mui/material"; 

// interface IFormSelect {
//   name: string;
//   control: any;
//   rules?: object;
//   options: {value: string, label: string}[];
//   error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
// }

// const FormSelect: React.FC<IFormSelect> = ({
//   name,
//   control,
//   options,
//   error,
// }) => {
//   return (
//     <div>
//       <Controller
//         name={name}
//         control={control}
//         render={({ field,}) => (
//           <TextField
//             select
//             label="Gender"
//             value={field.value}
//             // @ts-ignore
//             error={error}
//           >
//             {options.map((option) => (
//               <MenuItem key={option.value} value={option.value}>
//                 {option.label}
//               </MenuItem>
//             ))}
//           </TextField>
//           //   <TextField
//           //     labelId={`${name}-label`}
//           //     id={name}
//           //     value={field.value}
//           //     onChange={field.onChange}
//           //   >

//           //   </TextFi>
//         )}
//       />
//       {error && (
//         <FormHelperText sx={{ color: "red" }} id={`${name}-error`}>
//           {String(error?.message) || ""}
//         </FormHelperText>
//       )}
//     </div>
//   );
// };

// export default FormSelect;
