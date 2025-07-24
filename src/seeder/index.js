const { errorColor, successColor, cyanColor } = require('../helpers/color.helper');
const { dbConnection } = require('../models/dbConnection');
const adminSeeder = require('./admin.seeder');
const roleSeeder = require('./role.seeder');
const { permissionsSeeder } = require('./accessPermission.seeder');

async function seeder() {
  try {
    await dbConnection(); // Db connect.
    console.log(cyanColor, '✅ Seeding database...');

    await roleSeeder(); // Role seeder.
    await adminSeeder(); // Admin seeder.

    /** THIS COMMENTED CODE WILL USE IF WE WANT TO SET DYNAMIC PERMISSION FOR ROLE USING SLUG */
    await permissionsSeeder(); // Permission seeder.
    // await accessPermissionsSeeder(); // Access Permission seeder.

    // await countrySeeder(); // Country seeder.

    // await versionSeeder(); // Version seeder.

    console.log(successColor, '✅ All seeder run successfully...');

    /**
     * To exit with a 'failure' code use: process.exit(1)
     * To exit with a 'success' code use: process.exit(0)
     * Here we have used code 1 because it's process is used only one time when you change in seeder's files.
     */
    process.exit(0);
  } catch (error) {
    console.log(errorColor, '❌ Seeder error: ', error);
    process.exit(1);
  }
}

seeder(); // Seeder calling...
