import { Country, Person } from "@prisma/client";
import { format, getDate, getDayOfYear, getYear } from "date-fns";
import { enUS } from 'date-fns/locale';
import { pt } from 'date-fns/locale';
import { NextRouter } from "next/router";
import { Url } from "next/dist/shared/lib/router/router";

export const formatMessage = (language: string, translate: Function, person: Person, country: Country): string => {
  const locale = language === 'pt' ? pt : enUS;
  const birthDate = new Date(person.birthdate)
  const day = getDate(birthDate);
  const month = format(birthDate, 'LLLL', { locale });

  const currentDate = new Date();
  const birthdayOfYear = getDayOfYear(birthDate);
  const currentDayOfYear = getDayOfYear(currentDate);

  const bithYear = getYear(birthDate);
  const currentYear = getYear(currentDate);

  const age = currentYear - bithYear + (currentDayOfYear > birthdayOfYear ? 1 : 0);

  const message = translate('people.form.save.message', {
    name: person.name,
    country: country.name,
    day,
    month,
    age
  });

  return message;
}

export const changeLanguage = async(language: string, router: NextRouter, url: Url) => {
  switch(language){
    case 'en':
      await router.push(url, undefined, {locale: 'pt'});
      break;
    case 'pt':
      await router.push(url, undefined, {locale: 'en'});
      break;
   }
}