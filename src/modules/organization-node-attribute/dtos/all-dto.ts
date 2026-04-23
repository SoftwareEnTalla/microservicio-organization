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
export class BaseOrganizationNodeAttributeDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateOrganizationNodeAttribute',
    example: 'Nombre de instancia CreateOrganizationNodeAttribute',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateOrganizationNodeAttributeDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateOrganizationNodeAttribute).',
    example: 'Fecha de creación de la instancia (CreateOrganizationNodeAttribute).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateOrganizationNodeAttribute).',
    example: 'Fecha de actualización de la instancia (CreateOrganizationNodeAttribute).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateOrganizationNodeAttribute).',
    example:
      'Usuario que realiza la creación de la instancia (CreateOrganizationNodeAttribute).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateOrganizationNodeAttribute).',
    example: 'Estado de activación de la instancia (CreateOrganizationNodeAttribute).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Nodo dueño del atributo',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Nodo dueño del atributo', nullable: false })
  nodeId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Clave del atributo',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Clave del atributo', nullable: false })
  attributeKey!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Valor del atributo (serializado)',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Valor del atributo (serializado)', nullable: true })
  attributeValue?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo semántico',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo semántico', nullable: false })
  valueType!: string;

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
  constructor(partial: Partial<BaseOrganizationNodeAttributeDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class OrganizationNodeAttributeDto extends BaseOrganizationNodeAttributeDto {
  // Propiedades específicas de la clase OrganizationNodeAttributeDto en cuestión

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
  constructor(partial: Partial<OrganizationNodeAttributeDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<OrganizationNodeAttributeDto>): OrganizationNodeAttributeDto {
    const instance = new OrganizationNodeAttributeDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class OrganizationNodeAttributeValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => OrganizationNodeAttributeDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => OrganizationNodeAttributeDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class OrganizationNodeAttributeOutPutDto extends BaseOrganizationNodeAttributeDto {
  // Propiedades específicas de la clase OrganizationNodeAttributeOutPutDto en cuestión

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
  constructor(partial: Partial<OrganizationNodeAttributeOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<OrganizationNodeAttributeOutPutDto>): OrganizationNodeAttributeOutPutDto {
    const instance = new OrganizationNodeAttributeOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrganizationNodeAttributeDto extends BaseOrganizationNodeAttributeDto {
  // Propiedades específicas de la clase CreateOrganizationNodeAttributeDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateOrganizationNodeAttribute a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateOrganizationNodeAttributeDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateOrganizationNodeAttributeDto>): CreateOrganizationNodeAttributeDto {
    const instance = new CreateOrganizationNodeAttributeDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateOrganizationNodeAttributeDto {
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
    type: () => CreateOrganizationNodeAttributeDto,
    description: 'Instancia CreateOrganizationNodeAttribute o UpdateOrganizationNodeAttribute',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateOrganizationNodeAttributeDto, { nullable: true })
  input?: CreateOrganizationNodeAttributeDto | UpdateOrganizationNodeAttributeDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteOrganizationNodeAttributeDto {
  // Propiedades específicas de la clase DeleteOrganizationNodeAttributeDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteOrganizationNodeAttribute a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteOrganizationNodeAttribute a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateOrganizationNodeAttributeDto extends BaseOrganizationNodeAttributeDto {
  // Propiedades específicas de la clase UpdateOrganizationNodeAttributeDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateOrganizationNodeAttribute a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateOrganizationNodeAttributeDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateOrganizationNodeAttributeDto>): UpdateOrganizationNodeAttributeDto {
    const instance = new UpdateOrganizationNodeAttributeDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



