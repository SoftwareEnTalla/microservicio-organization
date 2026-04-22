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
import { CreatePlannedSeatDto, UpdatePlannedSeatDto, DeletePlannedSeatDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_planned_seat_node', ['nodeId'])
@Index('idx_planned_seat_job', ['jobTitleCode'])
@ChildEntity('plannedseat')
@ObjectType()
export class PlannedSeat extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de PlannedSeat",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de PlannedSeat", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia PlannedSeat' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de PlannedSeat",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de PlannedSeat", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia PlannedSeat' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Nodo al que pertenece la plaza',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Nodo al que pertenece la plaza', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Nodo al que pertenece la plaza' })
  nodeId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código del puesto',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código del puesto', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 80, comment: 'Código del puesto' })
  jobTitleCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Rol asociado',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Rol asociado', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 80, comment: 'Rol asociado' })
  roleCode?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Seniority',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Seniority', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 255, comment: 'Seniority' })
  seniority?: string = '';

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Cantidad planificada',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Cantidad planificada', nullable: false })
  @Column({ type: 'int', nullable: false, default: 1, comment: 'Cantidad planificada' })
  count!: number;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Plazas ocupadas',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Plazas ocupadas', nullable: false })
  @Column({ type: 'int', nullable: false, default: 0, comment: 'Plazas ocupadas' })
  filledCount!: number;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Salario mín',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Salario mín', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 18, scale: 2, comment: 'Salario mín' })
  salaryRangeMin?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Salario máx',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Salario máx', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 18, scale: 2, comment: 'Salario máx' })
  salaryRangeMax?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Moneda',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Moneda', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 8, comment: 'Moneda' })
  currency?: string = '';

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Plaza crítica',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Plaza crítica', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: false, comment: 'Plaza crítica' })
  isCritical!: boolean;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado de vacante',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado de vacante', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'OPEN', comment: 'Estado de vacante' })
  vacancyStatus!: string;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Metadatos' })
  metadata?: Record<string, any> = {};

  protected executeDslLifecycle(): void {
    // Rule: seat-requires-node
    // Toda plaza requiere nodeId.
    if (!(!(this.nodeId === undefined || this.nodeId === null || (typeof this.nodeId === 'string' && String(this.nodeId).trim() === '') || (Array.isArray(this.nodeId) && this.nodeId.length === 0) || (typeof this.nodeId === 'object' && !Array.isArray(this.nodeId) && Object.prototype.toString.call(this.nodeId) === '[object Object]' && Object.keys(Object(this.nodeId)).length === 0)))) {
      throw new Error('ORG_SEAT_001: nodeId requerido');
    }

    // Rule: seat-requires-job-title
    // Toda plaza requiere jobTitleCode.
    if (!(!(this.jobTitleCode === undefined || this.jobTitleCode === null || (typeof this.jobTitleCode === 'string' && String(this.jobTitleCode).trim() === '') || (Array.isArray(this.jobTitleCode) && this.jobTitleCode.length === 0) || (typeof this.jobTitleCode === 'object' && !Array.isArray(this.jobTitleCode) && Object.prototype.toString.call(this.jobTitleCode) === '[object Object]' && Object.keys(Object(this.jobTitleCode)).length === 0)))) {
      throw new Error('ORG_SEAT_002: jobTitleCode requerido');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'plannedseat';
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
  static fromDto(dto: CreatePlannedSeatDto): PlannedSeat;
  static fromDto(dto: UpdatePlannedSeatDto): PlannedSeat;
  static fromDto(dto: DeletePlannedSeatDto): PlannedSeat;
  static fromDto(dto: any): PlannedSeat {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(PlannedSeat, dto);
  }
}
