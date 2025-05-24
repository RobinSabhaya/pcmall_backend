const { successColor, errorColor } = require('../helpers/color.helper');
const { USER_ROLE } = require('../helpers/constant.helper');
const { Role } = require('../models/auth');
const { User } = require('../models/user');

const adminData = [
  {
    first_name: 'Admin',
    last_name: 'user',
    email: 'admin.pcmall@gmail.com',
    password: 'Admin@123',
    is_active: true,
  },
];

/**
 * Admin seeder.
 */
module.exports = adminSeeder = async () => {
  const adminRole = await Role.findOne({ role_slug: USER_ROLE.SUPER_ADMIN });

  try {
    for (let admin of adminData) {
      const adminExist = await User.findOne({ email: admin.email }); // Get Admin by email.

      if (!adminExist) await User.create({ ...admin, role: adminRole._id }); // If admin doesn't exists, create admin.
    }

    console.log(successColor, '✅ Admin seeder run successfully...');
  } catch (error) {
    console.log(errorColor, '❌ Error from admin seeder :', error);
  }
};
