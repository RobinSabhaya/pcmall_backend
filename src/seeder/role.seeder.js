// const { successColor, errorColor } = require('../helpers/color.helper');
// const { USERROLE } = require('../helpers/constant.helper');
// const { Role } = require('../models/auth');

// /**
//  * Role seeder.
//  */
// module.exports = roleSeeder = async () => {
//   try {
//     // const rolesData = Object.values(USERROLE) // Get all role name.
//     const rolesData = [
//       {
//         role: USERROLE.SUPER_ADMIN,
//         role_slug: USERROLE.SUPER_ADMIN,
//         slug: USERROLE.SUPER_ADMIN,
//         is_active: true,
//         deletedAt: null,
//       },
//       {
//         role: USERROLE.ADMIN,
//         role_slug: USERROLE.ADMIN,
//         slug: USERROLE.ADMIN,
//         is_active: true,
//         deletedAt: null,
//       },
//       {
//         role: USERROLE.BUYER,
//         role_slug: USERROLE.BUYER,
//         slug: USERROLE.BUYER,
//         is_active: true,
//         deletedAt: null,
//       },
//       {
//         role: USERROLE.SELLER,
//         role_slug: USERROLE.SELLER,
//         slug: USERROLE.SELLER,
//         is_active: true,
//         deletedAt: null,
//       },
//     ];

//     for (const role of rolesData) {
//       const alreadyExist = await Role.findOne({ role_slug: role.role_slug }); // Get role by role name.

//       if (!alreadyExist) await Role.create(role); // If role doesn't exists, create role.
//     }

//     console.log(successColor, '✅ Role seeder run successfully...');
//   } catch (error) {
//     console.log(errorColor, '❌ Error from role seeder :', error);
//   }
// };
