'use strict';

const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');
const { sanitizeEntity } = require('strapi-utils');
const mdName = 'recruitment';

module.exports = {
  create: async (ctx) => {
    try {
      const loggedUser = ctx.state.user;
      const params = ctx.request.body;
      params.recruiter = loggedUser.id;
      params.status = 'NEW';
      params.isPublished = true;

      return await strapi.query(mdName).create(params);
    } catch (ex) {
      strapi.log.error(ex);
      return ctx.badGateway('Server error');
    }
  },
  createContract: async (ctx) => {
    try {
      const loggedUser = ctx.state.user;
      const { id } = ctx.params;
      const { trxId } = ctx.request.body;

      const recruitment = await strapi.query(mdName).findOne({ id });
      if (!recruitment) {
        return ctx.notFound('recruitment.not.found')
      }

      if (!_.eq(recruitment.recruiter.id, loggedUser.id)) {
        return ctx.badRequest('recruitment.owner.required');
      }

      const iconData = await strapi.services.icon.getCreateContractData(trxId);
      if (!iconData) {
        return ctx.badRequest('invalid.trxId');
      }

      strapi.log.debug('iconData', iconData);

      const updated = await strapi.query(mdName).update({
        id
      }, {
        isPublish: false,
        contractId: iconData.contractId,
        creContractHash: trxId,
        contractSlug: uuidv4(),
        status: 'ON_PROCESS',
      })

      return sanitizeEntity(updated, { model: strapi.query(mdName).model });
    } catch (ex) {
      strapi.log.error(ex);
      return ctx.badGateway('Server error');
    }
  },
  getContractSlug: async (ctx) => {
    const { id } = ctx.params;
    const loggedUser = ctx.state.user;
    const recruitment = await strapi.query(mdName).findOne({ id });
    if (!recruitment) {
      return ctx.notFound('recruitment.not.found')
    }

    if (!recruitment.contractSlug) {
      return ctx.badRequest('invalid.contract');
    }

    if (!_.eq(recruitment.recruiter.id, loggedUser.id)) {
      return ctx.badRequest('recruitment.owner.required');
    }

    return {
      slug: recruitment.contractSlug,
    }
  },
  getContractBySlug: async (ctx) => {
    const { slug } = ctx.params;
    const recruitment = await strapi.query(mdName).findOne({ contractSlug: slug });
    if (!recruitment) {
      return ctx.notFound('recruitment.not.found')
    }

    return sanitizeEntity(recruitment, { model: strapi.query(mdName).model });
  },
  signContract: async (ctx) => {
    try {
      const { slug } = ctx.params;
      const loggedUser = ctx.state.user;
      const recruitment = await strapi.query(mdName).findOne({ contractSlug: slug });
      if (!recruitment) {
        return ctx.notFound('recruitment.not.found')
      }

      const { trxId } = ctx.request.body;

      const iconData = await strapi.services.icon.getSignContractData(trxId);
      if (!iconData) {
        return ctx.badRequest('invalid.trxId');
      }

      strapi.log.debug('iconData', iconData);

      if (!_.eq(recruitment.id, iconData.recruitment)) {
        return ctx.badRequest('recruitment.not.valid');
      }

      const updated = await strapi.query(mdName).update(
        { id: recruitment.id },
        {
          signContractHash: trxId,
          employee: loggedUser.id,
          deposit: iconData.deposit,
        }
      );
      return sanitizeEntity(updated, { model: strapi.query(mdName).model });
    } catch (ex) {
      strapi.log.error(ex);
      return ctx.badGateway('Server error');
    }
  },
  submit: async (ctx) => {
    try {
      console.log('ere')
      const { id } = ctx.params;
      const loggedUser = ctx.state.user;
      const params = ctx.request.body;
      const recruitment = await strapi.query(mdName).findOne({ id });
      if (!recruitment) {
        return ctx.notFound('recruitment.not.found')
      }

      if (!_.eq(loggedUser.id, recruitment.employee.id)) {
        return ctx.badRequest('contract.employee.required');
      }

      const product = await strapi.query('product').create({
        ...params,
        user: loggedUser.id,
        recruitment: recruitment.id,
      });

      const updated = await strapi.query(mdName).update(
        { id },
        {
          product: product.id,
          status: 'SUBMITTED',
        }
      );

      const entity = sanitizeEntity(updated, { model: strapi.query(mdName).model });
      entity.product = product;
      return entity;
    } catch (ex) {
      strapi.log.error(ex);
      return ctx.badGateway('Server error');
    }
  },
  approveContract: async (ctx) => {
    try {
      const { id } = ctx.params;
      const { trxId } = ctx.request.body;
      const loggedUser = ctx.state.user;
      const recruitment = await strapi.query(mdName).findOne({ id });
      if (!recruitment) {
        return ctx.notFound('recruitment.not.found')
      }

      if (!_.eq(recruitment.recruiter.id, loggedUser.id)) {
        return ctx.badRequest('recruitment.owner.required');
      }

      const iconData = await strapi.services.icon.getApproveContractData(trxId);
      if (!iconData) {
        return ctx.badRequest('invalid.trxId');
      }

      strapi.log.debug('iconData', iconData);

      if (_.eq(iconData.contractId, recruitment.contractId) && _.eq(iconData.recruitment, recruitment.id)) {
      } else {
        return ctx.badRequest('invalid.contract');
      }

      const updated = await strapi.query(mdName).update(
        { id },
        {
          status: 'DONE',
          completeContractHash: trxId,
        }
      );

      return sanitizeEntity(updated, { model: strapi.query(mdName).model });
    } catch (ex) {
      console.log(ex);
      strapi.log.error(ex);
      return ctx.badGateway('Server error');
    }
  },
  report: async (ctx) => {
    const { id } = ctx.params;
    const loggedUser = ctx.state.user;
    const recruitment = await strapi.query(mdName).findOne({ id });
    if (!recruitment) {
      return ctx.notFound('recruitment.not.found')
    }

    if (!_.eq(recruitment.recruiter.id, loggedUser.id)) {
      return ctx.badRequest('recruitment.owner.required');
    }

    const updated = await strapi.query(mdName).update(
      { id },
      {
        status: 'REPORT',
      }
    );

    return sanitizeEntity(updated, { model: strapi.query(mdName).model });
  },
  find: async (ctx) => {
    try {
      const params = {
        ...ctx.query,
        isPublish: true,
      };

      if (_.isEmpty(params._sort)) {
        params._sort = 'created_at:desc';
      }
      const page = await strapi.query(mdName).findPage(params);
      if (!_.isEmpty(page.results)) {
        page.results = page.results.map((item) => {
          return sanitizeEntity(item, { model: strapi.models[mdName] });
        });
      }
      return page;
    } catch (ex) {
      strapi.log.error(ex);
      return ctx.badGateway('Server error');
    }
  },
  findAllByUser: async (ctx) => {
    try {
      const loggedUser = ctx.state.user;
      const params = {
        ...ctx.query,
        _or: [
          {
            recruiter: loggedUser.id
          },
          {
            employee: loggedUser.id,
          }
        ],
      };

      if (_.isEmpty(params._sort)) {
        params._sort = 'created_at:desc';
      }
      const page = await strapi.query(mdName).findPage(params);
      if (!_.isEmpty(page.results)) {
        page.results = page.results.map((item) => {
          return sanitizeEntity(item, { model: strapi.models[mdName] });
        });
      }
      return page;
    } catch (ex) {
      strapi.log.error(ex);
      return ctx.badGateway('Server error');
    }
  },
  findOne: async (ctx) => {
    try {
      const { id } = ctx.params;
      const loggedUser = ctx.state.user;
      const recruitment = await strapi.query(mdName).findOne({ id });
      if (!recruitment) {
        return ctx.notFound('recruitment.not.found')
      }

      if (loggedUser && recruitment.product) {
        //only employee and recruiter approved contract can see full product
        if (_.eq(loggedUser.id, recruitment.employee.id)
        || (_.eq(loggedUser.id, recruitment.recruiter.id) && _.eq(recruitment.status, 'DONE'))) {

        } else {
          delete recruitment.product.url;
        }
      } else {
        // && _.isEmpty(recruitment.product)
        if (recruitment.product) delete recruitment.product.url;
      }

      return sanitizeEntity(recruitment, { model: strapi.query(mdName).model });
    } catch (ex) {
      strapi.log.error(ex);
      return ctx.badGateway('Server error');
    }
  }
};
