import { z } from "zod";
import { format, isValid, parse } from "date-fns";
import { enUS } from "date-fns/locale";

export const CreatePersonValidation = z.object({
  name: z.string().min(5, 'Field required and must contain at least 5 characters').max(50),
  surname: z.string().min(5, 'Field required and must contain at least 5 characters').max(50),
  birthdate: z.string().refine(value => validateDate(value), 'Birthdate must be filled and valid'),
  countryId: z.string().min(1, 'Field required'),
});

const validateDate = (text: string)=>{
  if(!text){
    return false;
  }
  try {
    new Date(text);
    return true;
  } catch (error) {
    return false;
  }
}