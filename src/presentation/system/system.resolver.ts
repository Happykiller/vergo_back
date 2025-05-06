// src\presentation\system\system.resolver.ts
import { Query, Resolver } from '@nestjs/graphql';

import { version } from '../../../package.json';
import inversify from '@src/inversify/investify';
import { Roles, USER_ROLE } from '@happykiller/sunny-apis';
import { SystemInfoResolverModel } from '@presentation/system/model/info.system.resolver.model';
import { SendMailSystemResolverModel } from '@presentation/system/model/send_mail.system.resolver.model';

@Resolver('SystemResolver')
export class SystemResolver {
  @Query(
    /* istanbul ignore next */
    () => SystemInfoResolverModel,
  )
  async systemInfo(): Promise<SystemInfoResolverModel> {
    return {
      version,
    };
  }

  @Roles(USER_ROLE.ADMIN)
  @Query(() => SendMailSystemResolverModel)
  async test_mail(): Promise<SendMailSystemResolverModel> {
    return await inversify.morgansServce.sendTest('fabrice.rosito@gmail.com');
  }
}
