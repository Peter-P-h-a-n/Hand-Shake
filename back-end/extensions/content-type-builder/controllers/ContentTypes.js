'use strict';

const _ = require('lodash');
const path = require('path');
const fs = require('fs');

const { hasDraftAndPublish } = require('strapi-utils').contentTypes;

const {
  validateContentTypeInput,
} = require('strapi-plugin-content-type-builder/controllers/validation/content-type');

const overrideFindControllers = (modelName) => {
  const controllersPath = path.join(strapi.dir, 'api', modelName, 'controllers', modelName + '.js');
  const contentFile = `'use strict';

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
        { model: '${modelName}' },
      );
    } else {
      entities = await strapi.entityService.findWithRelationCounts(
        { params: ctx.query },
        { model: '${modelName}' },
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
      data: results.map((entity) => sanitizeEntity(entity, { model: strapi.models.${modelName} })),
      pagination: pagination,
    });
  },
};`;

  return fs.promises.writeFile(controllersPath, contentFile);
};

module.exports = {
  async createContentType(ctx) {
    const { body } = ctx.request;

    try {
      await validateContentTypeInput(body);
    } catch (error) {
      return ctx.send({ error }, 400);
    }

    try {
      strapi.reload.isWatching = false;

      const contentTypeService = strapi.plugins['content-type-builder'].services.contenttypes;

      const contentType = await contentTypeService.createContentType({
        contentType: body.contentType,
        components: body.components,
      });

      const metricsProperties = {
        kind: contentType.kind,
        hasDraftAndPublish: hasDraftAndPublish(contentType.schema),
      };

      if (_.isEmpty(strapi.api)) {
        await strapi.telemetry.send('didCreateFirstContentType', metricsProperties);
      } else {
        await strapi.telemetry.send('didCreateContentType', metricsProperties);
      }

      const { modelName } = contentType;
      await overrideFindControllers(modelName);

      setImmediate(() => strapi.reload());

      ctx.send({ data: { uid: contentType.uid } }, 201);
    } catch (error) {
      strapi.log.error(error);
      await strapi.telemetry.send('didNotCreateContentType', { error: error.message });
      ctx.send({ error: error.message }, 400);
    }
  },
};
