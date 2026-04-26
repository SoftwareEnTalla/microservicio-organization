/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 * Contacto: softwarentalla@gmail.com
 * CEOs: 
 *       Persy Morell Guerra      Email: pmorellpersi@gmail.com  Phone : +53-5336-4654 Linkedin: https://www.linkedin.com/in/persy-morell-guerra-288943357/
 *       Dailyn García Domínguez  Email: dailyngd@gmail.com      Phone : +53-5432-0312 Linkedin: https://www.linkedin.com/in/dailyn-dominguez-3150799b/
 *
 * CTO: Persy Morell Guerra
 * COO: Dailyn García Domínguez and Persy Morell Guerra
 * CFO: Dailyn García Domínguez and Persy Morell Guerra
 *
 * Repositories: 
 *               https://github.com/SoftwareEnTalla 
 *
 *               https://github.com/apokaliptolesamale?tab=repositories
 *
 *
 * Social Networks:
 *
 *              https://x.com/SoftwarEnTalla
 *
 *              https://www.facebook.com/profile.php?id=61572625716568
 *
 *              https://www.instagram.com/softwarentalla/
 *              
 *
 *
 */


import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { CreateOrganizationNodeStatusDto, UpdateOrganizationNodeStatusDto } from "../dtos/all-dto";
import { createUnionType } from "@nestjs/graphql";

@ValidatorConstraint({ name: "isCreateOrUpdateOrganizationNodeStatusDtoType", async: false })
export class IsOrganizationNodeStatusTypeConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    // Verifica si el valor es un objeto y tiene la estructura esperada
    return (
      value instanceof CreateOrganizationNodeStatusDto || value instanceof UpdateOrganizationNodeStatusDto
    );
  }

  defaultMessage() {
    return "El valor debe ser un objeto de tipo CreateOrganizationNodeStatusDto o UpdateOrganizationNodeStatusDto";
  }
}

export function isCreateOrUpdateOrganizationNodeStatusDtoType(
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsOrganizationNodeStatusTypeConstraint,
    });
  };
}

// Crear un tipo de unión para GraphQL
export const OrganizationNodeStatusUnion = createUnionType({
  name: 'OrganizationNodeStatusUnion',
  types: () => [CreateOrganizationNodeStatusDto, UpdateOrganizationNodeStatusDto] as const,
});

