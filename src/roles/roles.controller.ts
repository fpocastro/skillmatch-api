import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { Role } from './domain/role';
import { CreateRoleDto } from './dto/create-role.dto';
import { NullableType } from 'src/utils/types/nullable.type';
import { Roles } from './decorators/roles.decorator';
import { RolesEnum } from './enums/roles.enum';
import { RolesGuard } from './guards/roles.guards';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolesEnum.ADMIN)
@ApiTags('Roles')
@Controller({
  path: 'roles',
  version: '1',
})
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOkResponse({
    type: [Role],
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @ApiOkResponse({
    type: Role,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: Role['id']): Promise<NullableType<Role>> {
    return this.rolesService.findById(id);
  }

  @ApiCreatedResponse({
    type: Role,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.rolesService.create(createRoleDto);
  }

  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Role,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(
    @Param('id') id: Role['id'],
    @Body() updateRoleDto: Partial<Role>,
  ): Promise<Role | null> {
    return this.rolesService.update(id, updateRoleDto);
  }

  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: Role['id']): Promise<void> {
    return this.rolesService.remove(id);
  }
}
