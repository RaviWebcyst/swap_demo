import { APIURL } from "../../utils/constants";
import { apiCallPostHeader } from "./axios.service";

export const TradeData = async (tk1Sym: string, tk2Sym?: string) => {
  if (tk1Sym) {
    try {
      const result: any = await apiCallPostHeader(
        APIURL.GET_DOLLAR_PRICE,
        {
          token0: tk1Sym,
          token1: tk2Sym,
        },
        {}
      );
      if (result) {
        return result.data.data;
      }
    } catch (error: any) {
      console.log(error.mesage);
    }
  }
};

export const getStakingData = async (chain: string, walletAddress: string,page:number, pageSize:number) => {
  try {
    ////////////////TODO
    const result: any = await apiCallPostHeader(
      APIURL?.GET_STAKE_DATA,
      {
        chain: chain,
        userAddress: walletAddress,
      },
      {
        page,
        pageSize
      }
    );
    if (result) {
      return{ result : result.data.data, totalCount : result.data.dataSize}
    }
  } catch (error: any) {
    console.log(error.mesage);
  }
};

export const getFarmData = async (chain: string, walletAddress: string) => {
  try {
    ////////////////TODO
    const result: any = await apiCallPostHeader(
      APIURL?.GET_FARM_DATA,
      {
        chain: chain,
        userAddress: walletAddress,
      },
      {}
    );
    if (result) {
      return result.data.data;
    }
  } catch (error: any) {
    console.log(error.mesage);
  }
};
