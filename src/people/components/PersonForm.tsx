import { Country } from "@prisma/client";
import { Form, FormProps } from "src/core/components/Form";
import {LabeledSelect} from "src/core/components/LabeledSelect";
import { LabeledTextField } from "src/core/components/LabeledTextField";
import { z } from "zod";
export { FORM_ERROR } from "src/core/components/Form";

export function PersonForm<S extends z.ZodType<any, any>>(props: FormProps<S> & { countries: Country[] }) {
  const selectCountries = props.countries
  ? props.countries.map((country) => ({ value: country.id, label: country.name }))
  : [];
  return (
    <Form<S> {...props}>
      <LabeledTextField
        name='name'
        label='Name'
        placeholder='Name'
      />
      <LabeledTextField
        name='surname'
        label='Surname'
        placeholder='Surname'
      />
      <LabeledTextField
        name='birthdate'
        label='Birthdate'
        placeholder='Birthdate'
        type="date"
      />
      <LabeledSelect 
        name="countryId" 
        label="country" 
        placeholder="Choose one" 
        items={selectCountries}/>
    </Form>
  );
}
