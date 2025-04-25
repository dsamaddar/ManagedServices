import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function allowedDomainValidator(allowedDomains: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;
    if (!email) return null;

    const isValid = allowedDomains.some(domain => email.toLowerCase().endsWith(`@${domain.toLowerCase()}`));
    console.log('domain validation');
    console.log(isValid);
    return isValid ? null : { forbiddenDomain: true };
  };
}