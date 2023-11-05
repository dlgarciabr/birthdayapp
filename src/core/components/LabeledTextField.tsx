import { forwardRef, PropsWithoutRef } from 'react';
import { useField, useFormikContext, ErrorMessage } from 'formik';
import { Box, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export interface LabeledTextFieldProps extends PropsWithoutRef<JSX.IntrinsicElements['input']> {
  name: string;
  label: string;
  rows?: number;
  fullWidth?: boolean;
  multiline?: boolean;
  counter?: boolean;
  type?: 'text' | 'password' | 'email' | 'number' | 'date';
  helperText?: string;
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements['div']>;
}

export const LabeledTextField = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  ({ name, label, rows, outerProps, helperText, counter = false, type, ...props }, ref) => {
    const [input, _meta, helper] = useField(name);
    const { isSubmitting } = useFormikContext();

    return (
      <div {...outerProps}>
        {type === 'date' ? 
          <DatePicker
            label={label}
            disabled={isSubmitting}
            ref={ref}
            value={null}
            onChange={
              async (value:Date) => {
                if(value){
                  await helper.setValue(value.toISOString());
                }
              }
            }
          /> : 
          <TextField
            {...props}
            label={label}
            {...input}
            rows={rows}
            multiline={!!rows}
            variant='outlined'
            color='primary'
            size='medium'
            disabled={isSubmitting}
            ref={ref}
            helperText={
              <Box component='span' sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{helperText}</span>
                {counter && <span>{`${(input.value as string).length} / ${props.maxLength}`}</span>}
              </Box>
            }
          />
        }        

        <ErrorMessage name={name}>
          {(msg) => (
            <div role='alert' style={{ color: 'red' }}>
              {msg}
            </div>
          )}
        </ErrorMessage>

        <style jsx>{`
          label {
            display: flex;
            flex-direction: column;
            align-items: start;
            font-size: 1rem;
          }
          input {
            font-size: 1rem;
            padding: 0.25rem 0.5rem;
            border-radius: 3px;
            border: 1px solid purple;
            appearance: none;
            margin-top: 0.5rem;
          }
        `}</style>
      </div>
    );
  }
);

export default LabeledTextField;
