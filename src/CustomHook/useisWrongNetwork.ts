import React, { useEffect } from "react";
import { useWalletConnect } from "./useWalletConnect";
import { useAppSelector } from "../app/hooks";

const useIsWrongNetwork = () => {
  const { walletAddress }: { walletAddress: string } = useAppSelector(
    (state: any) => state?.user
  );
  const { chainId }: { chainId: number | undefined } = useWalletConnect();

  return (
    chainId !== 11155111 &&
    chainId !== 97 &&
    chainId !== 900 &&
    chainId !== 137 &&
    chainId !== 8453 &&
    chainId !== 1151111081099710 &&
    chainId !== 42161 &&
    chainId !== 146 &&
    chainId !== 1 &&
    chainId !== 56 &&
    chainId !== 1209 &&
    chainId !== undefined &&
    Boolean(walletAddress)
  );
};

export default useIsWrongNetwork;
