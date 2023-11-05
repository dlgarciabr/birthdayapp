import { Country } from "@prisma/client";
import { useTranslation } from "next-i18next";
import { Form, FormProps } from "src/core/components/Form";
import {LabeledSelect} from "src/core/components/LabeledSelect";
import { LabeledTextField } from "src/core/components/LabeledTextField";
import { z } from "zod";
export { FORM_ERROR } from "src/core/components/Form";

export function PersonForm<S extends z.ZodType<any, any>>(props: FormProps<S> & { countries: Country[] }) {
  const { t } = useTranslation();
  const selectCountries = props.countries
  ? props.countries.map((country) => ({ value: country.id, label: country.name }))
  : [];
  return (
    <Form<S> {...props}>
      <LabeledTextField
        name='name'
        label={t('people.name.label')}
        fullWidth
      />
      <LabeledTextField
        name='surname'
        label={t('people.surname.label')}
        fullWidth
      />
      <LabeledTextField
        name='birthdate'
        label={t('people.birthday.label')}
        type="date"
        fullWidth
      />
      <LabeledSelect 
        name="countryId" 
        label={t('people.country.label')} 
        items={selectCountries}
        fullWidth/>
    </Form>
  );
}
