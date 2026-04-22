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
export class BaseHeadcountOverrideDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateHeadcountOverride',
    example: 'Nombre de instancia CreateHeadcountOverride',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateHeadcountOverrideDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateHeadcountOverride).',
    example: 'Fecha de creación de la instancia (CreateHeadcountOverride).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateHeadcountOverride).',
    example: 'Fecha de actualización de la instancia (CreateHeadcountOverride).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateHeadcountOverride).',
    example:
      'Usuario que realiza la creación de la instancia (CreateHeadcountOverride).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateHeadcountOverride).',
    example: 'Estado de activación de la instancia (CreateHeadcountOverride).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Nodo afectado',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Nodo afectado', nullable: false })
  nodeId!: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Valor anterior de actualHeadcount',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Valor anterior de actualHeadcount', nullable: false })
  previousValue!: number;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Nuevo valor',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Nuevo valor', nullable: false })
  newValue!: number;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Política de convivencia',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Política de convivencia', nullable: false })
  mode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Motivo del override',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Motivo del override', nullable: false })
  reason!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Usuario que aplicó',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Usuario que aplicó', nullable: false })
  appliedBy!: string;

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Fecha de aplicación',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Fecha de aplicación', nullable: false })
  appliedAt!: Date;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha opcional de expiración',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha opcional de expiración', nullable: true })
  expiresAt?: Date = new Date();

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
    type: () => Object,
    nullable: true,
    description: 'Metadatos',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos', nullable: true })
  metadata?: Record<string, any> = {};

  // Constructor
  constructor(partial: Partial<BaseHeadcountOverrideDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class HeadcountOverrideDto extends BaseHeadcountOverrideDto {
  // Propiedades específicas de la clase HeadcountOverrideDto en cuestión

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
  constructor(partial: Partial<HeadcountOverrideDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<HeadcountOverrideDto>): HeadcountOverrideDto {
    const instance = new HeadcountOverrideDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class HeadcountOverrideValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => HeadcountOverrideDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => HeadcountOverrideDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class HeadcountOverrideOutPutDto extends BaseHeadcountOverrideDto {
  // Propiedades específicas de la clase HeadcountOverrideOutPutDto en cuestión

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
  constructor(partial: Partial<HeadcountOverrideOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<HeadcountOverrideOutPutDto>): HeadcountOverrideOutPutDto {
    const instance = new HeadcountOverrideOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateHeadcountOverrideDto extends BaseHeadcountOverrideDto {
  // Propiedades específicas de la clase CreateHeadcountOverrideDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateHeadcountOverride a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateHeadcountOverrideDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateHeadcountOverrideDto>): CreateHeadcountOverrideDto {
    const instance = new CreateHeadcountOverrideDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateHeadcountOverrideDto {
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
    type: () => CreateHeadcountOverrideDto,
    description: 'Instancia CreateHeadcountOverride o UpdateHeadcountOverride',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateHeadcountOverrideDto, { nullable: true })
  input?: CreateHeadcountOverrideDto | UpdateHeadcountOverrideDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteHeadcountOverrideDto {
  // Propiedades específicas de la clase DeleteHeadcountOverrideDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteHeadcountOverride a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteHeadcountOverride a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateHeadcountOverrideDto extends BaseHeadcountOverrideDto {
  // Propiedades específicas de la clase UpdateHeadcountOverrideDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateHeadcountOverride a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateHeadcountOverrideDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateHeadcountOverrideDto>): UpdateHeadcountOverrideDto {
    const instance = new UpdateHeadcountOverrideDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



