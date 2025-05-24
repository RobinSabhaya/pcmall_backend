const { successColor, errorColor } = require('../helpers/color.helper');
const { USER_ROLE } = require('../helpers/constant.helper');
const { Role } = require('../models/auth');

/**
 * Role seeder.
 */
module.exports = roleSeeder = async () => {
  try {
    // const rolesData = Object.values(USER_ROLE) // Get all role name.
    const rolesData = [
      {
        role: USER_ROLE.SUPER_ADMIN,
        role_slug: USER_ROLE.SUPER_ADMIN,
        slug: USER_ROLE.SUPER_ADMIN,
        is_active: true,
        deletedAt: null,
      },
      {
        role: USER_ROLE.ADMIN,
        role_slug: USER_ROLE.ADMIN,
        slug: USER_ROLE.ADMIN,
        is_active: true,
        deletedAt: null,
      },
      {
        role: USER_ROLE.BUYER,
        role_slug: USER_ROLE.BUYER,
        slug: USER_ROLE.BUYER,
        is_active: true,
        deletedAt: null,
      },
      {
        role: USER_ROLE.SELLER,
        role_slug: USER_ROLE.SELLER,
        slug: USER_ROLE.SELLER,
        is_active: true,
        deletedAt: null,
      },
    ];

    for (let role of rolesData) {
      const alreadyExist = await Role.findOne({ role_slug: role.role_slug }); // Get role by role name.

      if (!alreadyExist) await Role.create(role); // If role doesn't exists, create role.
    }

    console.log(successColor, '✅ Role seeder run successfully...');
  } catch (error) {
    console.log(errorColor, '❌ Error from role seeder :', error);
  }
};
