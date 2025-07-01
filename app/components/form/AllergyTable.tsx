import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  styled,
  tableCellClasses,
  Typography,
  Grid,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import FormCheck from "./FormCheck";
import { useTranslations } from "next-intl";

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

function TableFormField({ name, columns = [] }: any) {
  const { register, watch, control } = useFormContext();
  const [rowCount, setRowCount] = useState(0);
  const t = useTranslations("Index");
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });
  const values = watch(name);

  return (
    <Table sx={{ mt: -2 }}>
      <TableHead></TableHead>
      <TableBody>
        {fields.map((row: any, rowIndex) => (
          <TableRow key={row.id}>
            {columns.map((col: any, index: number) => (
              <TableCell key={index} sx={{ p: 1 }}>
                <TextField
                  {...register(`${name}.${rowIndex}.${col.key}`)}
                  id={`${rowIndex}.${col.key}`}
                  fullWidth
                  label={t("medicalHistoryAllergy")}
                  sx={{ p: 0, width: "100%" }}
                />
                {values[rowIndex]?.[col.key] ? (
                  <>
                    {/* <TableCell sx={{ pr: 5 }}> */}
                    <Grid
                      container
                      sx={{
                        p: 1,
                        display: { xs: "flex" },
                        flexDirection: {
                          xs: "column",
                          sm: "row",
                        },
                        // alignItems: "center",
                        alignItems: { sm: "center" },
                      }}
                    >
                      <Grid item sm={5} xs={12}>
                        <FormCheck
                          name={`${name}.${rowIndex}.breathing_or_swollen_lips`}
                          control={control}
                          // rules={}
                          label={t("medicalHistoryTroubleBreathingSwollenLips")}
                          // @ts-ignore
                          error={""}
                        />
                      </Grid>
                      {/* </TableCell> */}
                      {/* <TableCell sx={{ pr: 5 }}> */}
                      <Grid item sm={2} xs={12}>
                        <FormCheck
                          name={`${name}.${rowIndex}.rash`}
                          control={control}
                          // rules={}
                          label={t("medicalHistoryRash")}
                          // @ts-ignore
                          error={""}
                        />
                      </Grid>
                      {/* </TableCell> */}
                      {/* <TableCell sx={{ pr: 5 }}> */}
                      <Grid item sm={5} xs={12}>
                        <TextField
                          label={t("medicalHistoryOther")}
                          fullWidth
                          {...register(`${name}.${rowIndex}.other`)}
                        />
                      </Grid>
                    </Grid>
                    {/* </TableCell> */}
                  </>
                ) : (
                  <></>
                )}
              </TableCell>
            ))}

            <TableCell sx={{ p: 0 }}>
              <IconButton
                onClick={() => {
                  remove(rowIndex);
                  setRowCount(() => rowCount - 1);
                }}
              >
                <Delete />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

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
                {t("medicalHistoryAddAllergy")}
              </Typography>
            </IconButton>
          </StyledTableCell>
        </TableRow>
      )}
    </Table>
  );
}

export default TableFormField;
