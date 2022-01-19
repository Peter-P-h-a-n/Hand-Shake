'use strict';

const _ = require('lodash');
const IconService = require('icon-sdk-js').default;
const { HttpProvider, IconConverter, IconBuilder, SignedTransaction, IconWallet } = IconService;
const { CallTransactionBuilder } = IconBuilder;
const httpProvider = new HttpProvider(process.env.ICON_API_URL || 'http://localhost:9082/api/v3');
const iconService = new IconService(httpProvider);
const godKeystoreDev = require('./godWalletDev.json');
const godKeystoreProd = require('./godWalletProd.json');
const score = process.env.ICON_SCORE_ADDRESS;
const nid = process.env.ICON_NID;
const version = process.env.ICON_VERSION;
const iconStage = process.env.ICON_STAGE;
const godPassword = process.env.ICON_GOD_WALLET_PASSWORD;

const createContractSC = 'createContract';
const CreateNewContract = 'CreateNewContract(Address,int,int,int)';

const signContract = 'signContract';
const EmployeeSignContract = 'EmployeeSignContract(Address,int,int,int)';

const completeContract = 'completeContract';
const ContractCompletion = 'ContractCompletion(Address,int,int)';

const unCompleteContract = 'unCompleteContract';
const UnCompleteContract = 'UnCompleteContract(int,int)';

async function getTransactionResult(txHash) {
  const results = { txResult: null, blockInfo: null };
  const txResult = await iconService.getTransactionResult(txHash).execute();
  if (_.isEmpty(txResult)) {
    // throw new Error('error: Transaction is empty');
    return results
  }

  if (_.eq(txResult.status, 0)) {
    strapi.log.debug({ txHash: txResult.txHash }, 'TransactionService.create(): transaction status is 0x0');
    return results;
    // throw new Error('error: Failed transaction (status: 0x0)');
  }

  const blockInfo = await iconService.getBlockByHash(txResult.blockHash).execute();

  strapi.log.debug({ blockHeight: blockInfo.height }, '------ Block info --------');
  if (_.isEmpty(blockInfo)) {
    // throw new Error('error: Cannot found block info');
    return results;
  }

  return {
    blockInfo,
    txResult,
  }
}

async function createTransaction(method, params) {
  try {
    strapi.log.info('[Create transaction] method: ', method, params);
    let godWallet;
    if (_.eq(iconStage, 'prod')) {
      godWallet = IconWallet.loadKeystore(godKeystoreProd, `${godPassword}`, true);
    } else {
      godWallet = IconWallet.loadKeystore(godKeystoreDev, `${godPassword}`, true);
    }
    // Build `CallTransaction` instance.
    const txObj = new CallTransactionBuilder()
      .from(godWallet.getAddress())
      .to(score)
      .stepLimit(IconConverter.toBigNumber('1000000'))
      .nid(IconConverter.toBigNumber(nid))
      .nonce(IconConverter.toBigNumber('1'))
      .version(IconConverter.toBigNumber(version))
      .timestamp((new Date()).getTime() * 1000)
      .method(method)
      .params(params)
      .build();
    const signedTransaction = new SignedTransaction(txObj, godWallet);
    const txHash = await iconService.sendTransaction(signedTransaction).execute();
    strapi.log.info('[Create transaction] hash {}', txHash);
    return txHash;
  } catch (ex) {
    strapi.log.error(ex);
  }
  return null;
}

module.exports = {
  getCreateContractData: async (trxId) => {
    const { txResult, blockInfo } = await getTransactionResult(trxId);
    let params = null;
    if (txResult && blockInfo) {
      const eventLogs = txResult.eventLogs;
      blockInfo.confirmedTransactionList.forEach((trans) => {
        const {data} = trans;
        if (_.eq(data.method, createContractSC)) {
          eventLogs.forEach((log) => {
            const indexed = log.indexed;
            if (_.eq(indexed[0], CreateNewContract)) {
              params = {};
              params.recruiter = indexed[1];
              params.contractId = IconConverter.toNumber(indexed[2]);
              params.recruitment = IconConverter.toNumber(log.data[0]);
              params.salary = IconConverter.toNumber(log.data[1]).toString();
            }
          });
        }
      });
    }
    return params;
  },
  getSignContractData: async (trxId) => {
    const { txResult, blockInfo } = await getTransactionResult(trxId);
    let params = null;
    if (txResult && blockInfo) {
      const eventLogs = txResult.eventLogs;
      blockInfo.confirmedTransactionList.forEach((trans) => {
        const {data} = trans;
        if (_.eq(data.method, signContract)) {
          eventLogs.forEach((log) => {
            const indexed = log.indexed;
            if (_.eq(indexed[0], EmployeeSignContract)) {
              params = {};
              params.employee = indexed[1];
              params.contractId = IconConverter.toNumber(indexed[2]);
              params.recruitment = IconConverter.toNumber(log.data[0]);
              params.deposit = IconConverter.toNumber(log.data[1]).toString();
            }
          });
        }
      });
    }
    return params;
  },
  getApproveContractData: async (trxId) => {
    const { txResult, blockInfo } = await getTransactionResult(trxId);
    let params = null;
    if (txResult && blockInfo) {
      const eventLogs = txResult.eventLogs;
      blockInfo.confirmedTransactionList.forEach((trans) => {
        const {data} = trans;
        if (_.eq(data.method, completeContract)) {
          eventLogs.forEach((log) => {
            const indexed = log.indexed;
            if (_.eq(indexed[0], ContractCompletion)) {
              params = {};
              params.recruiter = indexed[1];
              params.contractId = IconConverter.toNumber(indexed[2]);
              params.recruitment = IconConverter.toNumber(log.data[0]);
            }
          });
        }
      });
    }
    return params;
  },
  getUnCompletedContractData: async (trxId) => {
    const { txResult, blockInfo } = await getTransactionResult(trxId);
    let params = null;
    if (txResult && blockInfo) {
      const eventLogs = txResult.eventLogs;
      blockInfo.confirmedTransactionList.forEach((trans) => {
        const { data } = trans;
        if (_.eq(data.method, unCompleteContract)) {
          eventLogs.forEach((log) => {
            const indexed = log.indexed;
            if (_.eq(indexed[0], UnCompleteContract)) {
              params = {};
              params.contractId = IconConverter.toNumber(indexed[1]);
              params.whoFault = IconConverter.toNumber(log.data[0]);
            }
          });
        }
      });
    }

    return params;
  },
  callUnCompleteTrx: async (_id, whoFault) => {
    return await createTransaction('unCompleteContract', {_id: `${_id}`, whoFault: `${whoFault}` });
  },
};
