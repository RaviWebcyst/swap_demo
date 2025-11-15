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
    // chainId != 129 &&
    // chainId != 0 &&
    chainId != 1 &&
    chainId != 56 &&
    chainId != 1209 &&
    chainId !== undefined &&
    Boolean(walletAddress)
  );
};

export default useIsWrongNetwork;
