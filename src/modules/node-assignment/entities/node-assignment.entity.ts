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

import { Column, Entity, OneToOne, JoinColumn, ChildEntity, ManyToOne, OneToMany, ManyToMany, JoinTable, Index, Check, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CreateNodeAssignmentDto, UpdateNodeAssignmentDto, DeleteNodeAssignmentDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_node_assignment_node', ['nodeId'])
@Index('idx_node_assignment_employee', ['employeeId'])
@Index('idx_node_assignment_source_event', ['sourceEventId'], { unique: true })
@Unique('uq_node_assignment_source_event', ['sourceEventId'])
@ChildEntity('nodeassignment')
@ObjectType()
export class NodeAssignment extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de NodeAssignment",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de NodeAssignment", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia NodeAssignment' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de NodeAssignment",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de NodeAssignment", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia NodeAssignment' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Nodo afectado',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Nodo afectado', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Nodo afectado' })
  nodeId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Empleado (referencia HRMS)',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Empleado (referencia HRMS)', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Empleado (referencia HRMS)' })
  employeeId!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Número de empleado (cache)',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Número de empleado (cache)', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 40, comment: 'Número de empleado (cache)' })
  employeeNumber?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo de asignación',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de asignación', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, comment: 'Tipo de asignación' })
  action!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Puesto del empleado',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Puesto del empleado', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 80, comment: 'Puesto del empleado' })
  jobTitleCode?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Rol',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Rol', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 80, comment: 'Rol' })
  roleCode?: string = '';

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Momento del evento',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Momento del evento', nullable: false })
  @Column({ type: 'timestamp', nullable: false, comment: 'Momento del evento' })
  occurredAt!: Date;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'ID del evento Kafka origen (idempotencia)',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'ID del evento Kafka origen (idempotencia)', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 120, comment: 'ID del evento Kafka origen (idempotencia)' })
  sourceEventId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tópico Kafka origen',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tópico Kafka origen', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 200, comment: 'Tópico Kafka origen' })
  sourceTopic!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Correlación de saga',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Correlación de saga', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 120, comment: 'Correlación de saga' })
  correlationId?: string = '';

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos del evento original',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos del evento original', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Metadatos del evento original' })
  metadata?: Record<string, any> = {};

  protected executeDslLifecycle(): void {
    // Rule: assignment-requires-node
    // La asignación requiere nodeId.
    if (!(!(this.nodeId === undefined || this.nodeId === null || (typeof this.nodeId === 'string' && String(this.nodeId).trim() === '') || (Array.isArray(this.nodeId) && this.nodeId.length === 0) || (typeof this.nodeId === 'object' && !Array.isArray(this.nodeId) && Object.prototype.toString.call(this.nodeId) === '[object Object]' && Object.keys(Object(this.nodeId)).length === 0)))) {
      throw new Error('ORG_NA_001: nodeId requerido');
    }

    // Rule: assignment-requires-employee
    // La asignación requiere employeeId.
    if (!(!(this.employeeId === undefined || this.employeeId === null || (typeof this.employeeId === 'string' && String(this.employeeId).trim() === '') || (Array.isArray(this.employeeId) && this.employeeId.length === 0) || (typeof this.employeeId === 'object' && !Array.isArray(this.employeeId) && Object.prototype.toString.call(this.employeeId) === '[object Object]' && Object.keys(Object(this.employeeId)).length === 0)))) {
      throw new Error('ORG_NA_002: employeeId requerido');
    }

    // Rule: assignment-requires-source-event
    // La asignación requiere sourceEventId para idempotencia.
    if (!(!(this.sourceEventId === undefined || this.sourceEventId === null || (typeof this.sourceEventId === 'string' && String(this.sourceEventId).trim() === '') || (Array.isArray(this.sourceEventId) && this.sourceEventId.length === 0) || (typeof this.sourceEventId === 'object' && !Array.isArray(this.sourceEventId) && Object.prototype.toString.call(this.sourceEventId) === '[object Object]' && Object.keys(Object(this.sourceEventId)).length === 0)))) {
      throw new Error('ORG_NA_003: sourceEventId requerido');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'nodeassignment';
  }

  // Getters y Setters
  get getName(): string {
    return this.name;
  }
  set setName(value: string) {
    this.name = value;
  }
  get getDescription(): string {
    return this.description;
  }

  // Métodos abstractos implementados
  async create(data: any): Promise<BaseEntity> {
    Object.assign(this, data);
    this.executeDslLifecycle();
    this.modificationDate = new Date();
    return this;
  }
  async update(data: any): Promise<BaseEntity> {
    Object.assign(this, data);
    this.executeDslLifecycle();
    this.modificationDate = new Date();
    return this;
  }
  async delete(id: string): Promise<BaseEntity> {
    this.id = id;
    return this;
  }

  // Método estático para convertir DTOs a entidad con sobrecarga
  static fromDto(dto: CreateNodeAssignmentDto): NodeAssignment;
  static fromDto(dto: UpdateNodeAssignmentDto): NodeAssignment;
  static fromDto(dto: DeleteNodeAssignmentDto): NodeAssignment;
  static fromDto(dto: any): NodeAssignment {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(NodeAssignment, dto);
  }
}
