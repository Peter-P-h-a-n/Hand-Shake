'use strict';

const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    const user = ctx.state.user;
    let entities;

    if (ctx.query._q) {
      entities = await strapi.entityService.searchWithRelationCounts(
        { params: ctx.query },
        { model: 'product' },
      );
    } else {
      entities = await strapi.entityService.findWithRelationCounts(
        { params: ctx.query },
        { model: 'product' },
      );
    }

    const { results, pagination } = entities;

    if (strapi.services['user'].isSuperAdmin(user)) {
      return ctx.send({
        data: results,
        pagination: pagination,
      });
    }

    ctx.send({
      data: results.map((entity) => sanitizeEntity(entity, { model: strapi.models.product })),
      pagination: pagination,
    });
  },
};