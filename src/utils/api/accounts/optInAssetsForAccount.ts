import { ChainType } from '@/models/Chain';
import { TransactionToSignType } from '@/models/Transaction';
import WalletConnect from '@walletconnect/client';
import algosdk from 'algosdk';
import createTransactionToSign from '../transactions/createTransactionToSign';
import getTransactionParams from '../transactions/getTransactionParams';
import signTransactions from '../transactions/signTransactions';
import submitTransactions from '../transactions/submitTransactions';

import { setLoadingIndicator } from '@/redux/slices/applicationSlice';
import { Dispatch } from '@reduxjs/toolkit';
import { getAccountAssets } from '@/redux/slices/walletConnectSlice';

export default async function optInAssets(
  chain: ChainType,
  assetIndexes: number[],
  creatorWallet: WalletConnect,
  creatorAddress: string,
  dispatch: Dispatch,
) {
  const optInTxns = [];
  const suggestedParams = await getTransactionParams(chain);

  dispatch(
    setLoadingIndicator({
      isLoading: true,
      message: `Creating opt-in transactions...`,
    }),
  );

  for (const index of assetIndexes) {
    optInTxns.push(
      createTransactionToSign(
        algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: creatorAddress,
          to: creatorAddress,
          amount: 0,
          assetIndex: index,
          note: new Uint8Array(
            Buffer.from(
              ` I am an asset opt-in transaction for algoworld swapper escrow, thank you for using AlgoWorld Swapper (☞ ͡° ͜ʖ ͡°)☞`,
            ),
          ),
          suggestedParams,
        }),
        creatorWallet,
        TransactionToSignType.UserTransaction,
      ),
    );
  }

  dispatch(
    setLoadingIndicator({
      isLoading: true,
      message: `Signing transactions...`,
    }),
  );

  const signedSaveSwapConfigTxns = await signTransactions(
    optInTxns,
    creatorWallet,
  ).catch(() => {
    dispatch(setLoadingIndicator({ isLoading: false, message: undefined }));
    return undefined;
  });

  if (!signedSaveSwapConfigTxns) {
    dispatch(setLoadingIndicator({ isLoading: false, message: undefined }));
    return undefined;
  }

  dispatch(
    setLoadingIndicator({
      isLoading: true,
      message: `Submitting opt-in transactions, please wait...`,
    }),
  );

  const saveSwapConfigResponse = await submitTransactions(
    chain,
    signedSaveSwapConfigTxns,
  );

  dispatch(setLoadingIndicator({ isLoading: false, message: undefined }));

  // Makes sure to reload assets after opt-in
  dispatch(getAccountAssets({ chain, address: creatorAddress }) as any);

  return saveSwapConfigResponse.txId;
}