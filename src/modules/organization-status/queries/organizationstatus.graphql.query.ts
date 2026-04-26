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

import { Query, Resolver, Args } from '@nestjs/graphql'; 
import { OrganizationStatusDto } from '../dtos/all-dto';
import { OrganizationStatusGraphqlService } from '../services/organizationstatus.graphql.service';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => OrganizationStatusDto)
export class OrganizationStatusGraphqlQuery {
  constructor(private readonly service: OrganizationStatusGraphqlService) {}

  @Query(() => [OrganizationStatusDto], { name: 'findAllOrganizationStatuss' })
  async findAll(): Promise<OrganizationStatusDto[]> {
    return this.service.findAll();
  }

  @Query(() => OrganizationStatusDto, { name: 'findOrganizationStatusById' })
  async findById(
    @Args('id', { type: () => String }) id: string
  ): Promise<OrganizationStatusDto> {
    const result = await this.service.findById(id);
    if (!result) {
      throw new NotFoundException("OrganizationStatus con id " + id + " no encontrado");
    }
    return result;
  }
}
