'use strict';

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#cron-tasks
 */
const _ = require('lodash');
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
  /**
   * Every hour.
   */
  '0 * * * *': async () => {
    try {
      let countUnCompletedContract = await strapi.query('recruitment').count({
        status_in: ['ON_PROCESS', 'SUBMITTED'],
        employee_null: false,
        contractId_null: false,
        deadline_lt: new Date(),
      });
      strapi.log.info(`[Handle Un-Completed Contracts]: ${countUnCompletedContract}`);
      let chunkSize = 10;
      while (countUnCompletedContract > 0 && chunkSize-- > 0) {
        let recruitments = await strapi.query('recruitment').find({
          status_in: ['ON_PROCESS', 'SUBMITTED'],
          employee_null: false,
          contractId_null: false,
          deadline_lt: new Date(),
          _limit: chunkSize
        });
        if (recruitments.length <= 0) {
          break;
        }
        await Promise.allSettled(
          recruitments.map(async (recruitment) => {
            let whoFault = 0;
            if (_.eq(recruitment.status, 'ON_PROCESS')) {
              whoFault = 1;
            } else if (_.eq(recruitment.status, 'SUBMITTED')) {
              whoFault = 2;
            }
            if (_.eq(whoFault, 0)) {
              return false;
            }

            strapi.log.info(`[handle un-complete contract for]: contract ${recruitment.contractId}, fault: ${whoFault}`)

            const trxHash = await strapi.services.icon.callUnCompleteTrx(recruitment.contractId, whoFault);
            strapi.log.info(`[call transaction] hash ${trxHash}`);
            if (!trxHash) {
              strapi.log.info('[Call transaction] get error');
              await strapi.query('recruitment').update(
                { id: recruitment.id },
                {
                  status: 'FAILED',
                  unCompleteContractHash: trxHash,
                  whoFault: -1,
                }
              )
            } else {
              //wait for transaction success
              await snooze(5000);

              const iconData = await strapi.services.icon.getUnCompletedContractData(trxHash);
              strapi.log.info(`[Get transaction result] hash ${trxHash}, data: ${JSON.stringify(iconData)}`);
              if (!iconData) {
                strapi.log.info('[Can not get data by hash]');
                await strapi.query('recruitment').update(
                  { id: recruitment.id },
                  {
                    status: 'FAILED',
                    unCompleteContractHash: trxHash,
                    whoFault: 0,
                  }
                )
              } else {
                if (_.eq(iconData.contractId, recruitment.contractId)) {
                  await strapi.query('recruitment').update(
                    { id: recruitment.id },
                    {
                      status: 'UN_COMPLETE',
                      unCompleteContractHash: trxHash,
                      whoFault,
                    }
                  )
                } else {
                  await strapi.query('recruitment').update(
                    { id: recruitment.id },
                    {
                      status: 'FAILED',
                      unCompleteContractHash: trxHash,
                      whoFault,
                    }
                  )
                }

              }
            }
          }),
        );

        countUnCompletedContract = await strapi.query('recruitment').count({
          status_in: ['ON_PROCESS', 'SUBMITTED'],
          employee_null: false,
          contractId_null: false,
          deadline_lt: new Date(),
        });
      }
    } catch (ex) {
      strapi.log.error(ex);
    }
  }
};
