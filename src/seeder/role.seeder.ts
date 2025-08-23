import { successColor, errorColor } from '../helpers/color.helper';
import { USERROLE } from '../helpers/constant.helper';
import { createDoc, findOneDoc } from '../helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '../helpers/mongoose.model.helper';
import { IRole } from '../models/auth';

/**
 * Role seeder.
 */
export const roleSeeder = async (): Promise<void> => {
  try {
    // const rolesData = Object.values(USERROLE) // Get all role name.
    const rolesData = [
      {
        role: USERROLE.SUPER_ADMIN,
        role_slug: USERROLE.SUPER_ADMIN,
        slug: USERROLE.SUPER_ADMIN,
        is_active: true,
        deletedAt: null,
      },
      {
        role: USERROLE.ADMIN,
        role_slug: USERROLE.ADMIN,
        slug: USERROLE.ADMIN,
        is_active: true,
        deletedAt: null,
      },
      {
        role: USERROLE.BUYER,
        role_slug: USERROLE.BUYER,
        slug: USERROLE.BUYER,
        is_active: true,
        deletedAt: null,
      },
      {
        role: USERROLE.SELLER,
        role_slug: USERROLE.SELLER,
        slug: USERROLE.SELLER,
        is_active: true,
        deletedAt: null,
      },
    ];

    for (const role of rolesData) {
      // eslint-disable-next-line no-await-in-loop
      const alreadyExist = await findOneDoc<IRole>(MONGOOSE_MODELS.ROLE, {
        role_slug: role.role_slug,
      }); // Get role by role name.

      // eslint-disable-next-line no-await-in-loop
      if (alreadyExist == null) await createDoc(MONGOOSE_MODELS.ROLE, role); // If role doesn't exists, create role.
    }

    console.log(successColor, '✅ Role seeder run successfully...');
  } catch (error) {
    console.log(errorColor, '❌ Error from role seeder :', error);
  }
};
