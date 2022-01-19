'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');

const sanitizeUser = (user) =>
  sanitizeEntity(user, {
    model: strapi.query('user', 'users-permissions').model,
  });

const formatError = (error) => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] },
];

module.exports = {
  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.entityService.searchPage(
        { params: ctx.query },
        { model: 'plugins::users-permissions.user' },
      );
    } else {
      entities = await strapi.entityService.findPage(
        { params: ctx.query },
        { model: 'plugins::users-permissions.user' },
      );
    }

    const { results, pagination } = entities;

    ctx.send({
      data: results.map((entity) => sanitizeUser(entity)),
      pagination: pagination,
    });
  },

  async destroy(ctx) {
    const { id } = ctx.params;

    // Return bad request if users want to delete themselves
    if (ctx.state.user && ctx.state.user.id == id) {
      return ctx.badRequest(
        null,
        formatError({
          message: 'You could not delete yourself.',
        }),
      );
    }

    const data = await strapi.plugins['users-permissions'].services.user.remove({ id });
    ctx.send(sanitizeUser(data));
  },
};
