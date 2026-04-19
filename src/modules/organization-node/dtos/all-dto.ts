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
export class BaseOrganizationNodeDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateOrganizationNode',
    example: 'Nombre de instancia CreateOrganizationNode',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateOrganizationNodeDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateOrganizationNode).',
    example: 'Fecha de creación de la instancia (CreateOrganizationNode).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateOrganizationNode).',
    example: 'Fecha de actualización de la instancia (CreateOrganizationNode).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateOrganizationNode).',
    example:
      'Usuario que realiza la creación de la instancia (CreateOrganizationNode).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateOrganizationNode).',
    example: 'Estado de activación de la instancia (CreateOrganizationNode).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Organización raíz a la que pertenece',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Organización raíz a la que pertenece', nullable: false })
  organizationId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código único del nodo',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código único del nodo', nullable: false })
  nodeCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Nodo padre (null para raíz)',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Nodo padre (null para raíz)', nullable: true })
  parentId?: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Path materializado (ej. ORG.VP.DEV.FRONTEND)',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Path materializado (ej. ORG.VP.DEV.FRONTEND)', nullable: false })
  path!: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Profundidad en el árbol',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Profundidad en el árbol', nullable: false })
  depth!: number;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo de nodo',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de nodo', nullable: false })
  nodeType!: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Plantilla planificada (lleva)',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Plantilla planificada (lleva)', nullable: false })
  targetHeadcount!: number;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Plantilla real (tiene) calculada por eventos HRMS',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Plantilla real (tiene) calculada por eventos HRMS', nullable: false })
  actualHeadcount!: number;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Valor sobrescrito manualmente',
  })
  @IsInt()
  @IsOptional()
  @Field(() => Int, { description: 'Valor sobrescrito manualmente', nullable: true })
  actualHeadcountManual?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Política de convivencia entre override manual y eventos HRMS',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Política de convivencia entre override manual y eventos HRMS', nullable: false })
  overrideMode!: string;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Permite exceder targetHeadcount',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Permite exceder targetHeadcount', nullable: false })
  allowOverAssignment!: boolean;

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
    description: 'Centro de costo',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Centro de costo', nullable: true })
  costCenterCode?: string = '';

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Presupuesto',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Presupuesto', nullable: true })
  budget?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Moneda',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Moneda', nullable: true })
  currency?: string = '';

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
  constructor(partial: Partial<BaseOrganizationNodeDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class OrganizationNodeDto extends BaseOrganizationNodeDto {
  // Propiedades específicas de la clase OrganizationNodeDto en cuestión

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
  constructor(partial: Partial<OrganizationNodeDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<OrganizationNodeDto>): OrganizationNodeDto {
    const instance = new OrganizationNodeDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class OrganizationNodeValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => OrganizationNodeDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => OrganizationNodeDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class OrganizationNodeOutPutDto extends BaseOrganizationNodeDto {
  // Propiedades específicas de la clase OrganizationNodeOutPutDto en cuestión

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
  constructor(partial: Partial<OrganizationNodeOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<OrganizationNodeOutPutDto>): OrganizationNodeOutPutDto {
    const instance = new OrganizationNodeOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrganizationNodeDto extends BaseOrganizationNodeDto {
  // Propiedades específicas de la clase CreateOrganizationNodeDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateOrganizationNode a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateOrganizationNodeDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateOrganizationNodeDto>): CreateOrganizationNodeDto {
    const instance = new CreateOrganizationNodeDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateOrganizationNodeDto {
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
    type: () => CreateOrganizationNodeDto,
    description: 'Instancia CreateOrganizationNode o UpdateOrganizationNode',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateOrganizationNodeDto, { nullable: true })
  input?: CreateOrganizationNodeDto | UpdateOrganizationNodeDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteOrganizationNodeDto {
  // Propiedades específicas de la clase DeleteOrganizationNodeDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteOrganizationNode a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteOrganizationNode a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateOrganizationNodeDto extends BaseOrganizationNodeDto {
  // Propiedades específicas de la clase UpdateOrganizationNodeDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateOrganizationNode a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateOrganizationNodeDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateOrganizationNodeDto>): UpdateOrganizationNodeDto {
    const instance = new UpdateOrganizationNodeDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



