'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  getUserByAddress: async (address) => {
    let user = await strapi.query('user','users-permissions').findOne({ address });
    const role = await strapi.query('role', 'users-permissions').findOne({ type: 'authenticated' }, []);
    if (!user) {
      user = await strapi.query('user', 'users-permissions').create({
        email: `${address}@handshake.io`,
        username: address,
        address,
        password: uuidv4(),
        confirmed: true,
        blocked: false,
        role: role.id
      });
    }


    return user;
  },
  getLoginSession: async (user) => {
    const loginSession = uuidv4();

    await strapi.query('user', 'users-permissions').update(
      { id: user.id },
      {
        loginSession,
        confirmed: true,
        blocked: false,
      });

    return {
      user,
      loginSession,
    };
  }
};
