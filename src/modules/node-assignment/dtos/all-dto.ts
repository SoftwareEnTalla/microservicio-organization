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
export class BaseNodeAssignmentDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateNodeAssignment',
    example: 'Nombre de instancia CreateNodeAssignment',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateNodeAssignmentDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateNodeAssignment).',
    example: 'Fecha de creación de la instancia (CreateNodeAssignment).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateNodeAssignment).',
    example: 'Fecha de actualización de la instancia (CreateNodeAssignment).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateNodeAssignment).',
    example:
      'Usuario que realiza la creación de la instancia (CreateNodeAssignment).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateNodeAssignment).',
    example: 'Estado de activación de la instancia (CreateNodeAssignment).',
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
    type: () => String,
    nullable: false,
    description: 'Empleado (referencia HRMS)',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Empleado (referencia HRMS)', nullable: false })
  employeeId!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Número de empleado (cache)',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Número de empleado (cache)', nullable: true })
  employeeNumber?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo de asignación',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de asignación', nullable: false })
  action!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Puesto del empleado',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Puesto del empleado', nullable: true })
  jobTitleCode?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Rol',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Rol', nullable: true })
  roleCode?: string = '';

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Momento del evento',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Momento del evento', nullable: false })
  occurredAt!: Date;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'ID del evento Kafka origen (idempotencia)',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'ID del evento Kafka origen (idempotencia)', nullable: false })
  sourceEventId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tópico Kafka origen',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tópico Kafka origen', nullable: false })
  sourceTopic!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Correlación de saga',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Correlación de saga', nullable: true })
  correlationId?: string = '';

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos del evento original',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos del evento original', nullable: true })
  metadata?: Record<string, any> = {};

  // Constructor
  constructor(partial: Partial<BaseNodeAssignmentDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class NodeAssignmentDto extends BaseNodeAssignmentDto {
  // Propiedades específicas de la clase NodeAssignmentDto en cuestión

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
  constructor(partial: Partial<NodeAssignmentDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<NodeAssignmentDto>): NodeAssignmentDto {
    const instance = new NodeAssignmentDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class NodeAssignmentValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => NodeAssignmentDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => NodeAssignmentDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class NodeAssignmentOutPutDto extends BaseNodeAssignmentDto {
  // Propiedades específicas de la clase NodeAssignmentOutPutDto en cuestión

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
  constructor(partial: Partial<NodeAssignmentOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<NodeAssignmentOutPutDto>): NodeAssignmentOutPutDto {
    const instance = new NodeAssignmentOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateNodeAssignmentDto extends BaseNodeAssignmentDto {
  // Propiedades específicas de la clase CreateNodeAssignmentDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateNodeAssignment a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateNodeAssignmentDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateNodeAssignmentDto>): CreateNodeAssignmentDto {
    const instance = new CreateNodeAssignmentDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateNodeAssignmentDto {
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
    type: () => CreateNodeAssignmentDto,
    description: 'Instancia CreateNodeAssignment o UpdateNodeAssignment',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateNodeAssignmentDto, { nullable: true })
  input?: CreateNodeAssignmentDto | UpdateNodeAssignmentDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteNodeAssignmentDto {
  // Propiedades específicas de la clase DeleteNodeAssignmentDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteNodeAssignment a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteNodeAssignment a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateNodeAssignmentDto extends BaseNodeAssignmentDto {
  // Propiedades específicas de la clase UpdateNodeAssignmentDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateNodeAssignment a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateNodeAssignmentDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateNodeAssignmentDto>): UpdateNodeAssignmentDto {
    const instance = new UpdateNodeAssignmentDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



