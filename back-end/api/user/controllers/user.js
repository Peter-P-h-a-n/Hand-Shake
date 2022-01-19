'use strict';

const _ = require('lodash');
const { sanitizeEntity } = require('strapi-utils')


module.exports = {
  loginSession: async (ctx) => {
    try {
      const { address } = ctx.query;

      if (!address) {
        return ctx.badRequest('address.required');
      }

      const user = await strapi.services.user.getUserByAddress(address);
      return await strapi.services.user.getLoginSession(user);
    } catch (ex) {
      strapi.log.error(ex);
      return ctx.badGateway('Server error');
    }
  },
  authenticate: async (ctx) => {
    try {
      const { address, trxId } = ctx.request.body;

      if (!address) {
        return ctx.badRequest('address.required');
      }

      if (!trxId) {
        return ctx.badRequest('trxId.required');
      }

      if (!_.startsWith(trxId, '0x')) {
        return ctx.badRequest('invalid.signature');
      }

      const user = await strapi.services.user.getUserByAddress(address);

      ctx.send({
        jwt: strapi.plugins['users-permissions'].services.jwt.issue({
          id: user.id
        }),
        user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
          model: strapi.query('user', 'users-permissions').model,
        }),
      });
    } catch (ex) {
      strapi.log.error(ex);
      return ctx.badGateway('Server error');
    }
  },
  findOne: async (ctx) => {
    const loggedUser = ctx.state.user;
    return sanitizeEntity(loggedUser.toJSON ? loggedUser.toJSON() : loggedUser, {
      model: strapi.query('user', 'users-permissions').model,
    })
  }
};
