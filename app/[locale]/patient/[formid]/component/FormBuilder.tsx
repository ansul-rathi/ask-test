import React from 'react';
import { useForm, SubmitHandler, FieldValues, Controller } from 'react-hook-form';
import { z, object, string } from 'zod';
import { TextField, Button } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';

type FormValues = Record<string, string>;

interface FormBuilderProps {
  schema: z.ZodObject<any, 'strip', z.ZodTypeAny, { [key: string]: any }, { [key: string]: any }>;
  onSubmit: SubmitHandler<FormValues>;
  defaultValues?: FormValues;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ schema, onSubmit, defaultValues }) => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {Object.keys(schema.shape).map((fieldName) => (
        <Controller
          key={fieldName}
          control={control}
          name={fieldName}
          render={({ field }) => (
            <TextField
              label={fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
              error={!!errors[fieldName]}
              helperText={errors[fieldName]?.message}
              {...field}
            />
          )}
        />
      ))}
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
};

export default FormBuilder;
