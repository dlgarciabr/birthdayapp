import { Country, Person } from "@prisma/client";
import { format, getDate, getDayOfYear, getYear } from "date-fns";
import { enUS } from 'date-fns/locale';

export const formatMessage = (values: Person, country: Country): string =>{
  const birthDate = new Date(values.birthdate)
  const day = getDate(birthDate);
  const month = format(birthDate, 'LLLL', { locale: enUS });

  const currentDate = new Date();
  const birthdayOfYear = getDayOfYear(birthDate);
  const currentDayOfYear = getDayOfYear(currentDate);

  const bithYear = getYear(birthDate);
  const currentYear = getYear(currentDate);

  const age = currentYear - bithYear + (currentDayOfYear > birthdayOfYear ? 1 : 0);

  return `Hello ${values.name} from ${country?.name}. on ${day} of ${month} you will be ${age} old!`;
}