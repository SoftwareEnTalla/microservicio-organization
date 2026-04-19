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

import { InputType, Field, Float, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsObject,
  IsUUID,
  ValidateNested,
} from 'class-validator';




@InputType()
export class BaseOrganizationDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateOrganization',
    example: 'Nombre de instancia CreateOrganization',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateOrganizationDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateOrganization).',
    example: 'Fecha de creación de la instancia (CreateOrganization).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateOrganization).',
    example: 'Fecha de actualización de la instancia (CreateOrganization).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateOrganization).',
    example:
      'Usuario que realiza la creación de la instancia (CreateOrganization).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateOrganization).',
    example: 'Estado de activación de la instancia (CreateOrganization).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código único de la organización',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código único de la organización', nullable: false })
  organizationCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Nombre comercial',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Nombre comercial', nullable: true })
  tradeName?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo', nullable: false })
  organizationType!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'CIF/RUC/NIF',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'CIF/RUC/NIF', nullable: true })
  taxId?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Industria',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Industria', nullable: true })
  industry?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'País (ISO-3166)',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'País (ISO-3166)', nullable: true })
  country?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Región',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Región', nullable: true })
  region?: string = '';

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de fundación',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de fundación', nullable: true })
  foundedAt?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado', nullable: false })
  status!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Sitio web',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Sitio web', nullable: true })
  website?: string = '';

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos', nullable: true })
  metadata?: Record<string, any> = {};

  // Constructor
  constructor(partial: Partial<BaseOrganizationDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class OrganizationDto extends BaseOrganizationDto {
  // Propiedades específicas de la clase OrganizationDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador único de la instancia',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<OrganizationDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<OrganizationDto>): OrganizationDto {
    const instance = new OrganizationDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class OrganizationValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => OrganizationDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => OrganizationDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class OrganizationOutPutDto extends BaseOrganizationDto {
  // Propiedades específicas de la clase OrganizationOutPutDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador único de la instancia',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<OrganizationOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<OrganizationOutPutDto>): OrganizationOutPutDto {
    const instance = new OrganizationOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrganizationDto extends BaseOrganizationDto {
  // Propiedades específicas de la clase CreateOrganizationDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateOrganization a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateOrganizationDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateOrganizationDto>): CreateOrganizationDto {
    const instance = new CreateOrganizationDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateOrganizationDto {
  @ApiProperty({
    type: () => String,
    description: 'Identificador',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  @ApiProperty({
    type: () => CreateOrganizationDto,
    description: 'Instancia CreateOrganization o UpdateOrganization',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateOrganizationDto, { nullable: true })
  input?: CreateOrganizationDto | UpdateOrganizationDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteOrganizationDto {
  // Propiedades específicas de la clase DeleteOrganizationDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteOrganization a eliminar',
    default: '',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id: string = '';

  @ApiProperty({
    type: () => String,
    description: 'Lista de identificadores de instancias a eliminar',
    example:
      'Se proporciona una lista de identificadores de DeleteOrganization a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateOrganizationDto extends BaseOrganizationDto {
  // Propiedades específicas de la clase UpdateOrganizationDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateOrganization a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateOrganizationDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateOrganizationDto>): UpdateOrganizationDto {
    const instance = new UpdateOrganizationDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



