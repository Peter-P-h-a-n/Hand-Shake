'use strict';

const emailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = {
  async createSuperAdminUser({ username, password, email }) {
    const params = {
      username,
      password,
      email,
      confirmed: true,
      provider: 'local',
    };

    const pluginStore = await strapi.store({
      environment: '',
      type: 'plugin',
      name: 'users-permissions',
    });

    const settings = await pluginStore.get({
      key: 'advanced',
    });

    // Throw an error if super admin role does not exist
    let superAdminRole = await strapi
      .query('role', 'users-permissions')
      .findOne({ name: 'Super Admin' }, ['permissions']);

    if (!superAdminRole) {
      throw new Error('Could not create user because super admin role does not exist');
    }

    // Throw an error if the password selected by the user
    // contains more than three times the symbol '$'.
    if (strapi.plugins['users-permissions'].services.user.isHashed(params.password)) {
      throw new Error(
        'Your super admin password cannot contain more than three times the symbol `$`.',
      );
    }

    // Throw an error if the provided username is already taken.
    const isTakenUsername = await strapi.query('user', 'users-permissions').findOne({
      username: params.username,
    });

    if (isTakenUsername) {
      throw new Error('Your super admin username is already taken');
    }
    // Throw an error if the provided email is not valid.
    const isEmail = emailRegExp.test(params.email);

    if (isEmail) {
      params.email = params.email.toLowerCase();
    } else {
      throw new Error('Your super admin email is not valid');
    }

    // Throw an error if the provided email is already taken.
    const user = await strapi.query('user', 'users-permissions').findOne({
      email: params.email,
    });

    if (user && user.provider === params.provider) {
      throw new Error('Your super admin email is already taken');
    }

    if (user && user.provider !== params.provider && settings.unique_email) {
      throw new Error('Your super admin email is already taken');
    }

    // Create a new super admin user
    params.role = superAdminRole.id;
    params.password = await strapi.plugins['users-permissions'].services.user.hashPassword(params);

    const newUser = await strapi.query('user', 'users-permissions').create(params);
    return newUser;
  },
};
