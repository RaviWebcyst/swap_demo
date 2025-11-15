import { useDispatch } from "react-redux";
import DynamicABI from "../../assets/abi/erc20.json";
import proxyABI from "../../assets/abi/proxy.json";
import tokenAabi from "../../assets/abi/tokenA.ABI.json";
import exchangeABI from "../../assets/abi/exchange.ABI.json";
import { store } from "../../app/store";
import Web3 from "web3";
import { networkConfig } from "../../utils/constants";
import { walletConnectAlert } from "../../utils/helpers";

let web3Object: any;

export const callWeb3 = async (walletProvider: any) => {
  try {
    const { ethereum }: any = window;

    if (walletProvider) {
      const provider = new Web3(walletProvider);
      web3Object = provider;
      const chainId = await provider?.eth?.getChainId();
      var chainValues = store.getState()?.user?.chainValues;
      var { network }: any = await networkConfig(chainValues?.chainId);




      if (
        (window?.location?.pathname != "/cross-chain" &&
          chainId != network?.chainId) ||
        (window?.location?.pathname == "/cross-chain")
      ) {
        // walletConnectAlert(
        //   network?.name

        // );

        await walletProvider?.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId:
                window?.location?.pathname != "/cross-chain"
                  ? network?.chainIdHex
                  : Web3.utils.toHex(
                    network?.chainId
                  ),
            },
          ],
        });
      }
      return provider;
    } else if (ethereum) {
      const provider = new Web3(ethereum);
      web3Object = provider;
      return provider;
    }
    else {
      // const provider = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/");
      const provider = new Web3(store.getState()?.user?.chainValues?.rpcUrl);
      web3Object = provider;
      return provider;
    }
  } catch (error) {
    console.log("callweb3 error", error);
    throw error;
  }
};

/**CALL COONTRACT'S GET METHODS */
export const callContractGetMethod = (
  method: string,
  data: any,
  contractType: string,
  dynamicAddress: string,
  walletProvider: any
) => {
  return async (dispatch = useDispatch()) => {
    try {
      const result = await callGetMethod(
        method,
        data,
        contractType,
        dynamicAddress,
        walletProvider
      );

      return result;
    } catch (error) {
      throw error;
    }
  };
};

/**CALL COONTRACT'S SEND METHODS */
export function callContractSendMethod(
  method: string,
  data: any,
  walletAddress: string,
  contractType: string,
  value: any,
  dynamicAddress: string,
  walletProvider: any,
  gasPrice: any
) {
  return async (dispatch = useDispatch(), getState: any) => {
    try {

      const result = await callSendMethod(
        method,
        data,
        walletAddress,
        contractType,
        value,
        dynamicAddress,
        walletProvider,
        gasPrice
      );


      return result;
    } catch (error) {
      console.log("error", error);
      return error;
    }
  };
}
export function callGasMethod(
  method: string,
  data: any,
  walletAddress: string,
  contractType: string,
  value: any,
  dynamicAddress: string,
  walletProvider: any,
  gasPrice: any
) {
  return async (dispatch = useDispatch(), getState: any) => {
    try {
      const result = await callGasFindMethod(
        method,
        data,
        walletAddress,
        contractType,
        value,
        dynamicAddress,
        walletProvider,
        gasPrice
      );
      return result;
    } catch (error) {
      console.log("error", error);
      return error;
    }
  };
}
let web3Instance: any, icoInstance: any;
let dynamicInstance = web3Instance;

export const createInstance = async (walletProvider: any) => {
  try {
    /**CREATE CONTRACT INSTANCE WITH ABI */

    let web3 = await callWeb3(walletProvider);
    web3Instance = web3;
    return web3;
  } catch (error) {
    throw error;
  }
};

/**SEND CONTRACT TYPE AND DYAMIC ADDRESS(OPTIONAL) FOR GET CONTRACT INSTANCE*/
export const getContractInstance = async (
  contractType: string,
  dynamicAddress: string,
  walletProvider: any
) => {

  let list = store.getState()?.user?.contractDetails;


  var abi = list?.panCakeSwap?.abi;




  if (!walletProvider) {
    try {
      if (list) {
        return new Promise(async (resolve, reject) => {
          switch (contractType) {
            case "pancakeSwap":
              dynamicInstance = web3Instance ?
                dynamicInstance = await new web3Instance.eth.Contract(
                  JSON.parse(JSON.stringify(abi)),
                  dynamicAddress
                )
                : await createInstance(walletProvider).then(
                  async (provider: any) => {
                    return await new provider.eth.Contract(
                      JSON.parse(JSON.stringify(abi)),
                      dynamicAddress
                    );
                  }
                );
              resolve(dynamicInstance);
              break;
            case "quote":
              dynamicInstance = web3Instance ?
                dynamicInstance = await new web3Instance.eth.Contract(
                  JSON.parse(JSON.stringify(list?.quote.abi)),
                  dynamicAddress
                )
                : await createInstance(walletProvider).then(
                  async (provider: any) => {
                    return await new provider.eth.Contract(
                      JSON.parse(JSON.stringify(list?.quote.abi)),
                      dynamicAddress
                    );
                  }
                );
              resolve(dynamicInstance);
              break;
            default:
              return null;
          }
        });
      }
    }
    catch (error) {
      console.error(error);
      throw error;
    }

  }
  else {
    try {
      if (list) {
        return new Promise(async (resolve, reject) => {
          switch (contractType) {
            case "ico":
              return icoInstance
                ? resolve(icoInstance)
                : createInstance(walletProvider)
                  .then(() => {
                    resolve(icoInstance);
                  })
                  .catch(reject);
            case "dynamic":
              dynamicInstance = await createInstance(walletProvider).then(
                async (provider: any) => {
                  return await new provider.eth.Contract(
                    JSON.parse(JSON.stringify(DynamicABI)),
                    dynamicAddress
                  );
                }
              );
              resolve(dynamicInstance);
              break;
            case "factory":
              dynamicInstance = web3Instance
                ? await new web3Instance.eth.Contract(
                  JSON?.parse(JSON?.stringify(list?.factory?.abi)),
                  dynamicAddress
                )
                : await createInstance(walletProvider).then(
                  async (provider: any) => {
                    return await new provider.eth.Contract(
                      JSON.parse(JSON.stringify(list?.factory?.abi)),
                      dynamicAddress
                    );
                  }
                );
              resolve(dynamicInstance);
              break;
            case "marketTokenContract":
              dynamicInstance = web3Instance
                ? await new web3Instance.eth.Contract(
                  JSON?.parse(JSON?.stringify(tokenAabi)),
                  dynamicAddress
                )
                : await createInstance(walletProvider).then(
                  async (provider: any) => {
                    return await new provider.eth.Contract(
                      JSON.parse(JSON.stringify(tokenAabi)),
                      dynamicAddress
                    );
                  }
                );
              resolve(dynamicInstance);
              break;
            case "marketExchangeContract":
              dynamicInstance = web3Instance
                ? await new web3Instance.eth.Contract(
                  JSON?.parse(JSON?.stringify(exchangeABI)),
                  dynamicAddress
                )
                : await createInstance(walletProvider).then(
                  async (provider: any) => {
                    return await new provider.eth.Contract(
                      JSON.parse(JSON.stringify(exchangeABI)),
                      dynamicAddress
                    );
                  }
                );
              resolve(dynamicInstance);
              break;
            case "router":
              dynamicInstance = web3Instance
                ? await new web3Instance.eth.Contract(
                  JSON.parse(JSON.stringify(list?.router?.abi)),
                  dynamicAddress
                )
                : await createInstance(walletProvider).then(
                  async (provider: any) => {
                    return await new provider.eth.Contract(
                      JSON.parse(JSON.stringify(list?.router?.abi)),
                      dynamicAddress
                    );
                  }
                );
              resolve(dynamicInstance);
              break;
            case "quote":
              dynamicInstance = web3Instance ?
                dynamicInstance = await new web3Instance.eth.Contract(
                  JSON.parse(JSON.stringify(list?.quote.abi)),
                  dynamicAddress
                )
                : await createInstance(walletProvider).then(
                  async (provider: any) => {
                    return await new provider.eth.Contract(
                      JSON.parse(JSON.stringify(list?.quote.abi)),
                      dynamicAddress
                    );
                  }
                );
              resolve(dynamicInstance);
              break;
            case "uniswapv3":
              dynamicInstance = web3Instance ?
                dynamicInstance = await new web3Instance.eth.Contract(
                  JSON.parse(JSON.stringify(list?.uniswapv3.abi)),
                  dynamicAddress
                )
                : await createInstance(walletProvider).then(
                  async (provider: any) => {
                    return await new provider.eth.Contract(
                      JSON.parse(JSON.stringify(list?.uniswapv3.abi)),
                      dynamicAddress
                    );
                  }
                );
              resolve(dynamicInstance);
              break;
            case "panRouter":
              dynamicInstance = web3Instance
                ? await new web3Instance.eth.Contract(
                  JSON.parse(JSON.stringify(list?.panRouter?.abi)),
                  dynamicAddress
                )
                : await createInstance(walletProvider).then(
                  async (provider: any) => {
                    return await new provider.eth.Contract(
                      JSON.parse(JSON.stringify(list?.router?.abi)),
                      dynamicAddress
                    );
                  }
                );
              resolve(dynamicInstance);
              break;
            case "pancakeRouter":
              dynamicInstance = web3Instance
                ? await new web3Instance.eth.Contract(
                  JSON.parse(JSON.stringify(list?.panCake?.abi)),
                  dynamicAddress
                )
                : await createInstance(walletProvider).then(
                  async (provider: any) => {
                    return await new provider.eth.Contract(
                      JSON.parse(JSON.stringify(list?.panCake?.abi)),
                      dynamicAddress
                    );
                  }
                );
              resolve(dynamicInstance);
              break;
            case "pancakeSwap":
              dynamicInstance = web3Instance
                ? await new web3Instance.eth.Contract(
                  JSON.parse(JSON.stringify(abi)),
                  dynamicAddress
                )
                : await createInstance(walletProvider).then(
                  async (provider: any) => {
                    return await new provider.eth.Contract(
                      JSON.parse(JSON.stringify(abi)),
                      dynamicAddress
                    );
                  }
                );
              resolve(dynamicInstance);
              break;
            case "proxy":
              dynamicInstance = web3Instance
                ? await new web3Instance.eth.Contract(
                  JSON.parse(JSON.stringify(proxyABI)),
                  dynamicAddress
                )
                : await createInstance(walletProvider).then(
                  async (provider: any) => {
                    return await new provider.eth.Contract(
                      JSON.parse(JSON.stringify(proxyABI)),
                      dynamicAddress
                    );
                  }
                );
              resolve(dynamicInstance);
              break;
            case "staking":
              dynamicInstance = web3Instance
                ? await new web3Instance.eth.Contract(
                  JSON.parse(JSON.stringify(list?.stakingFactory?.abi)),
                  dynamicAddress
                )
                : await createInstance(walletProvider).then(
                  async (provider: any) => {
                    return await new provider.eth.Contract(
                      JSON.parse(JSON.stringify(list?.stakingFactory?.abi)),
                      dynamicAddress
                    );
                  }
                );
              resolve(dynamicInstance);
              break;
            case "farm":
              dynamicInstance = web3Instance
                ? await new web3Instance.eth.Contract(
                  JSON.parse(JSON.stringify(list?.farm?.abi)),
                  dynamicAddress
                )
                : await createInstance(walletProvider).then(
                  async (provider: any) => {
                    return await new provider.eth.Contract(
                      JSON.parse(JSON.stringify(list?.farm?.abi)),
                      dynamicAddress
                    );
                  }
                );
              resolve(dynamicInstance);
              break;
            case "pair":
              dynamicInstance = web3Instance
                ? await new web3Instance.eth.Contract(
                  JSON.parse(JSON.stringify(list?.pair?.abi)),
                  dynamicAddress
                )
                : await createInstance(walletProvider).then(
                  async (provider: any) => {
                    return await new provider.eth.Contract(
                      JSON.parse(JSON.stringify(list?.pair?.abi)),
                      dynamicAddress
                    );
                  }
                );
              resolve(dynamicInstance);
              break;
            default:
              return null;
          }
        });
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};

/**CALL CONTRACT GET METHODS. ALL PARAMS WILL BE DYNAMIC */
export const callGetMethod = async (
  method: string,
  data: any,
  contractType: string,
  dynamicAddress: string,
  walletProvider: any
) => {




  return new Promise(async (resolve, reject) => {
    try {
      /**GET SELECTED CONTRACT INSTANCE */
      let contract: any = await getContractInstance(
        contractType,
        dynamicAddress,
        walletProvider
      );








      // await contract.methods
      // .getAmountsOut(...data).call().then((result: any) => {
      //       console.log("in then:", result);
      //       resolve(result);
      //     })
      //     .catch((error: any) => {
      //       console.log("in catch:", error);
      //       reject(error);
      //     });





      if (contract && contract?.methods) {


        if (method == 'quoteExactOutputSingle' || method == 'quoteExactInputSingle') {


          var params1 = {
            tokenIn: data[1][0],
            tokenOut: data[1][1],
            fee: 3000,
            amountIn: data[0],   // ✅ BN
            sqrtPriceLimitX96: 0,
          };




          await contract.methods[method](params1).call()
            .then((result: any) => {
              // console.log("contract_address",dynamicAddress);

              console.log("in then:", result);
              resolve(result);
            })
            //  .apply(null, Array.prototype.slice.call([params]))
            // .send({ from: '0xB9AD3f83c016f1270151C1b6104A67968C7C48BC', gas: 500000 }).then((result: any) => {
            //   resolve(result);
            //   return result;
            // })
            .catch((error: any) => {
              reject(error);
            });
        }
        // else{
        // var params = {
        //   tokenIn: data[1][0],
        //   tokenOut: data[1][1],
        //   fee: 3000,
        //   amountIn: data[0],   // ✅ BN
        //   sqrtPriceLimitX96: 0,
        // };

        //  await contract.methods[method](params).call()
        //  .then((result: any) => {
        //   // console.log("contract_address",dynamicAddress);

        //     console.log("in then:", result);
        //     resolve(result);
        //   })
        // //  .apply(null, Array.prototype.slice.call([params]))
        //   // .send({ from: '0xB9AD3f83c016f1270151C1b6104A67968C7C48BC', gas: 500000 }).then((result: any) => {
        //   //   resolve(result);
        //   //   return result;
        //   // })
        //   .catch((error: any) => {
        //     reject(error);
        //   });
        // }
        // }
        else {
          /**CALL GET METHOD */
          await contract.methods[method](...data)
            .call()
            .then((result: any) => {
              console.log("in then:", result);
              resolve(result);
            })
            .catch((error: any) => {
              console.log("in catch:", error);
              reject(error);
            });
        }

      } else {
        reject(new Error("Contract not found."));
      }


    } catch (error) {
      console.log("error", error);
      reject(error);
    }

  });
};

export const validateVal = (v: any): any => {
  const t = typeof v != "string" ? `${v}` : v;
  if (
    /^0x[A-Fa-f0-9]*$/.test(t) || // addr, r,s
    /^true|false$/.test(t) // bool
  )
    return v;
  return `${isNaN(parseFloat(v)) ? "0" : v}`;
};

/**CALL CONTRACT SEND METHODS. ALL PARAMS WILL BE DYNAMIC */
export const callSendMethod = async (
  method: string,
  data: any,
  walletAddress: string,
  contractType: string,
  value: any,
  dynamicAddress: string,
  walletProvider: any,
  gasPrice: any
) => {

  console.log(method, "method");
  console.log(data, "data");
  console.log(walletAddress, "walletAddress");
  console.log(contractType, "contractType");
  console.log(value, "value");
  console.log(dynamicAddress, "dynamicAddress");

  const chainValues = store.getState()?.user?.chainValues;
  // console.log('ffsdsfsdfs');
  // console.log(chainValues);
  return new Promise(async (resolve, reject) => {
    try {
      /**CHECK WALLET IS CONNECTED */
      if (walletAddress === "") {
        reject(new Error("Please connect wallet"));
      }

      /**CREATE DATA FOR CALL SEND METHOD */
      let dataForSend: any = method == "deposit" ? { from: walletAddress, value: validateVal(value), gasPrice: gasPrice } : { from: walletAddress, value: validateVal(value) };





      /**GET SELECTED CONTRACT INSTANCE */
      let contract: any = await getContractInstance(
        contractType,
        dynamicAddress,
        walletProvider
      );


      if (contract.methods) {
        /**ESTIMATE GAS FOR TRANSACTION */
        // console.log("------");
        // console.log(data);
        // console.log(dataForSend);
        // console.log(contractType);
        // console.log(method);
        // console.log("------");

        if (dynamicAddress == '0xB971eF87ede563556b2ED4b1C0b0019111Dd85d2') {

        var params = {
            tokenIn: data[1][0],
            tokenOut: data[1][1],
            fee: 3000,
            amountIn: data[0],  
            sqrtPriceLimitX96: 0,
            recipient: walletAddress,
          };

//           {
//     "tokenIn": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
//     "tokenOut": "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
//     "fee": 3000,
//     "recipient": "0xB9AD3f83c016f1270151C1b6104A67968C7C48BC",
//     "sqrtPriceLimitX96": 0,
//     "deadline": 1761371846,
//     "amountIn": "10000000000000",
//     "amountOutMinimum": "5588153560548924"
// }

          console.log(params,"parmas");
          

          await contract.methods[method](params).call()
            .then((result: any) => {
              console.log("in then:", result);
              resolve(result);
            })
            .catch((error: any) => {
              reject(error);
            });
        }
        else {
          const gasLimit = await contract.methods[method]
            .apply(null, Array.prototype.slice.call(data))
            .estimateGas(dataForSend);

          //  dataForSend.gasLimit = Number(gasLimit?.toFixed());


          if (chainValues?.chainId == 1209) {
            dataForSend.gasLimit = Number(gasLimit?.toFixed());
          } else {
            dataForSend.gasLimit = Number((gasLimit * 1.2)?.toFixed());

          }


          /**CALL SEND METHOD */
          contract?.methods[method]
            .apply(null, Array.prototype.slice.call(data))
            .send(dataForSend)
            .then((result: any) => {
              resolve(result);
              return result;
            })
            .catch((error: any) => {
              reject(error);
            });
        }
      } else {
        reject(new Error("Contract not found."));
      }
    } catch (error) {
      console.log("erroorroorr", error);
      reject(error);
      return error;
    }
  });
};
export const callGasFindMethod = async (method: string,
  data: any,
  walletAddress: string,
  contractType: string,
  value: any,
  dynamicAddress: string,
  walletProvider: any,
  gasPrice: any) => {
  const chainValues = store.getState()?.user?.chainValues;
  return new Promise(async (resolve, reject) => {
    try {
      /**CHECK WALLET IS CONNECTED */
      if (walletAddress === "") {
        reject(new Error("Please connect wallet"));
      }

      /**CREATE DATA FOR CALL SEND METHOD */
      let dataForSend: any = { from: walletAddress, value: validateVal(value), gasPrice: gasPrice };
      /**GET SELECTED CONTRACT INSTANCE */
      let contract: any = await getContractInstance(
        contractType,
        dynamicAddress,
        walletProvider
      );
      if (contract.methods) {
        /**ESTIMATE GAS FOR TRANSACTION */
        contract?.methods[method]
          .apply(null, Array.prototype.slice.call(data))
          .estimateGas(dataForSend)
          .then((result: any) => {
            resolve(result);
            return result;
          })

      } else {
        reject(new Error("Contract not found."));
      }
    } catch (error) {
      console.log("error", error);
      reject(error);
      return error;
    }
  });


}