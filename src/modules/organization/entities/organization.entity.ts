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
import { CreateOrganizationDto, UpdateOrganizationDto, DeleteOrganizationDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_organization_code', ['organizationCode'], { unique: true })
@Index('idx_organization_tax_id', ['taxId'])
@Unique('uq_organization_code', ['organizationCode'])
@ChildEntity('organization')
@ObjectType()
export class Organization extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de Organization",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de Organization", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia Organization' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de Organization",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de Organization", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia Organization' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código único de la organización',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código único de la organización', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 80, unique: true, comment: 'Código único de la organización' })
  organizationCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Nombre comercial',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Nombre comercial', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 200, comment: 'Nombre comercial' })
  tradeName?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'COMPANY', comment: 'Tipo' })
  organizationType!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'CIF/RUC/NIF',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'CIF/RUC/NIF', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 40, comment: 'CIF/RUC/NIF' })
  taxId?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Industria',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Industria', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 120, comment: 'Industria' })
  industry?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'País (ISO-3166)',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'País (ISO-3166)', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 8, comment: 'País (ISO-3166)' })
  country?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Región',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Región', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 80, comment: 'Región' })
  region?: string = '';

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de fundación',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de fundación', nullable: true })
  @Column({ type: 'date', nullable: true, comment: 'Fecha de fundación' })
  foundedAt?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'ACTIVE', comment: 'Estado' })
  status!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Sitio web',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Sitio web', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 255, comment: 'Sitio web' })
  website?: string = '';

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
    // Rule: organization-code-required
    // La organización requiere organizationCode.
    if (!(!(this.organizationCode === undefined || this.organizationCode === null || (typeof this.organizationCode === 'string' && String(this.organizationCode).trim() === '') || (Array.isArray(this.organizationCode) && this.organizationCode.length === 0) || (typeof this.organizationCode === 'object' && !Array.isArray(this.organizationCode) && Object.prototype.toString.call(this.organizationCode) === '[object Object]' && Object.keys(Object(this.organizationCode)).length === 0)))) {
      throw new Error('ORG_ORG_001: organizationCode requerido');
    }

    // Rule: organization-name-required
    // La organización requiere nombre.
    if (!(!(this.name === undefined || this.name === null || (typeof this.name === 'string' && String(this.name).trim() === '') || (Array.isArray(this.name) && this.name.length === 0) || (typeof this.name === 'object' && !Array.isArray(this.name) && Object.prototype.toString.call(this.name) === '[object Object]' && Object.keys(Object(this.name)).length === 0)))) {
      throw new Error('ORG_ORG_002: name requerido');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'organization';
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
  static fromDto(dto: CreateOrganizationDto): Organization;
  static fromDto(dto: UpdateOrganizationDto): Organization;
  static fromDto(dto: DeleteOrganizationDto): Organization;
  static fromDto(dto: any): Organization {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(Organization, dto);
  }
}
