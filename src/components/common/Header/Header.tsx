import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Container } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Select from 'react-select'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { CheckIcon, CurrencyEthereum, Menu, LightMenu, MoonIcon, SunIcon } from '../../../assets/icons/svgicons'
import lightLogo from '../../../assets/logo/light-logo.svg'
import logo from '../../../assets/logo/logo.svg'
import smallLogo from '../../../assets/logo/small-logo.svg'
import { useWalletConnect } from '../../../CustomHook/useWalletConnect'
import { setTheme } from '../../../features/theme/theme.slice'
import { ROUTES, NETWORKS, wagmiAdapter } from '../../../utils/constants'
import { customizeAddress } from '../../../utils/helpers'
import Button from '../Button/Button'
import Sidebar from '../Sidebar/Sidebar'
import ConnectWallet from './ConnectWallet/ConnectWallet'
import './Header.scss'
import { NetworkTypes } from '../../../interfaces/common'
import { setImportedLps } from '../../../features/theme/user.slice'

import EthIcon from "../../../assets/icons/tokens/EthIcon.svg";



import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {

  PhantomWalletAdapter,
  SolflareWalletAdapter,

} from '@solana/wallet-adapter-wallets'
import { WalletModalProvider, WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'
import { useAppKit, useAppKitAccount, useAppKitNetwork, useDisconnect, useWalletInfo } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'


require('@solana/wallet-adapter-react-ui/styles.css')

type propTypes = {
  active?: boolean
  handleActive?: () => void
}

const Header = (props: propTypes) => {
  const { theme } = useAppSelector((state) => state.theme)
  const dispatch = useAppDispatch()
  const location = useLocation()
  // Access the current path
  const currentPath = location.pathname

  const queryClient = new QueryClient()
  const { tokenOne, tokenTwo }: { tokenOne: any; tokenTwo: any } = useAppSelector(
    (store: any) => store?.token,
  )




  const { setNetworkInReduxState } = useWalletConnect()

  const walletAddress = useSelector((state: any) => state?.user?.walletAddress)
  const solanawalletAddress = useSelector((state: any) => state?.user?.solanawalletAddress)
  const selectedChain: NetworkTypes = useSelector((state: any) => state?.user?.chainValues)
 

  const [show, setShow] = useState(false)
  const [isNetworkSwitched, setIsSwitchedNetwork] = useState(false)
  const [routeDetail, setRouteDetail] = useState<string>(window?.location?.pathname)
  const handleChange = () => {
    dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'))
  }

  const navigate = useNavigate();

  var wallet = useWalletInfo();
  var {walletInfo} = useWalletInfo("solana");
  var {walletInfo:evmWallet} = useWalletInfo("eip155");
  
  const [imageError, setImageError] = useState(false)


  useEffect(() => {

    if (!sessionStorage.getItem('cacheCleared')) {
      sessionStorage.setItem('cacheCleared', 'true');

      if ('caches' in window) {
        caches.keys().then(function (names) {
          for (let name of names) caches.delete(name);
        });
      }

      // Reload page after clearing cache
      window.location.reload();
    }

    if (selectedChain?.chainId === 900 && location.pathname === '/swap') {


      setNetworkInReduxState(56)
    }
    if (selectedChain?.chainId !== 900 && location.pathname === '/solana') {


      setNetworkInReduxState(900)
    }

  

    if (isNetworkSwitched) {
      dispatch(setImportedLps([]))
      setIsSwitchedNetwork(false)
    }
  }, [selectedChain, isNetworkSwitched, location, solanawalletAddress,walletAddress])



  // connecting  for the solana
  const network = WalletAdapterNetwork.Devnet
  

  const endpoint = useMemo(() => clusterApiUrl(network), [network])
 
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    
    ],
    [network],
  )





  const { open } = useAppKit()
  const { address, isConnected, caipAddress, status, embeddedWalletInfo } = useAppKitAccount()
  const { disconnect } = useDisconnect()

  const handleWalletConnect = async () => {
    if (address) {
      disconnect()
    } else {
      open({ view: 'Connect' });

      setNetworkInReduxState(tokenOne.chainId);

    }
  }

  return (
    <>
     <header className="header">
        <Container fluid className="px-40">
          <div className="header_in">
            <Link to={ROUTES.HOME} className={"header_logo"}>
            <h1>Swap</h1>
              {/* <img
                className="d-sm-block d-none"
                src=""
                alt="logo"
              />
              <img src="" alt="logo" className="d-sm-none" /> */}
            </Link>
            <Sidebar
              handleActive={props.handleActive}
              active={props.active}
              setRouteDetail={setRouteDetail}
            />
            <div className="header_action">
            
            
              <WagmiProvider config={wagmiAdapter.wagmiConfig}>
                <QueryClientProvider client={queryClient}>
                  {currentPath !== '/' && currentPath !== '/solana' && (
                    <div className="natwork_btn" >
                      
                        <div className="networkdiv d-flex justify-content-center"><img src={`${tokenOne.chainId !=1151111081099710  ? EthIcon :"https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/solana.svg"}`} alt="network" className='rounded-circle' /></div>
                      {/* <Select
                        isDisabled={false}
                        options={NETWORKS}
                        defaultValue={selectedChain || NETWORKS[0]}
                        // value={selectedChain}
                        value={selectedChain?.chainId ==1151111081099710 ? NETWORKS[1] : NETWORKS[0]}
                        classNamePrefix={'select'}
                        isSearchable={false}
                        placeholder={<CurrencyEthereum />}
                        
                        className="header_select"
                        formatOptionLabel={(options: NetworkTypes) => {
                          return (
                            <>
                              <img src={options?.icon || "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/ethereum.svg"} alt={options.label} />
                              <span>{options.label}</span>
                              {(options?.chainId == 1151111081099710 && options?.chainId == selectedChain?.chainId)  ? <CheckIcon /> : (options?.label == "EVM" && selectedChain?.chainId != 1151111081099710)  ?  <CheckIcon />:'' }
                            </>
                          )
                        }}
                      /> */}
                    </div>
                  )}

                
                  {currentPath !== '/solana' ? (
                    <>
                      <div className="vertical-line"></div>
                      <div className="connect_btn">
                        {(tokenOne.chainId !=1151111081099710 && walletAddress) || (tokenOne.chainId ==1151111081099710 && solanawalletAddress)? (

                          <Button onClick={() => setShow(true)}>
                            <>
                              {imageError ? (

                                <svg
                                  width='24'
                                  height='24'
                                  focusable="false"
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M18 4H6C3.79 4 2 5.79 2 8v8c0 2.21 1.79 4 4 4h12c2.21 0 4-1.79 4-4V8c0-2.21-1.79-4-4-4m-1.86 9.77c-.24.2-.57.28-.88.2L4.15 11.25C4.45 10.52 5.16 10 6 10h12c.67 0 1.26.34 1.63.84zM6 6h12c1.1 0 2 .9 2 2v.55c-.59-.34-1.27-.55-2-.55H6c-.73 0-1.41.21-2 .55V8c0-1.1.9-2 2-2"></path>
                                </svg>
                              ) : (
                              <img src={tokenOne.chainId !=1151111081099710 && walletAddress ? evmWallet?.icon : tokenOne.chainId ==1151111081099710 && solanawalletAddress ? walletInfo?.icon:""} className="no-border px-2" onError={() => setImageError(true)} width={30} />
                              )}
                            </>
                            {/* <span>{customizeAddress(address || '')} </span> */}
                            <span >{customizeAddress(tokenOne.chainId ==1151111081099710 ?  solanawalletAddress : walletAddress || '')} </span>
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              handleWalletConnect()
                            }}
                          >
                            Connect
                          </Button>
                        )}
                      </div>
                      <div className="vertical-line"></div>
                    </>
                  ) : (
                    ''
                  )}
                </QueryClientProvider>
              </WagmiProvider>

              {/* <div className="d-sm-block d-none">

                <button className={`theme_btn ${theme === 'dark' ? 'active' : ''}`} onClick={handleChange}>
                  <motion.div layout>
                    <AnimatePresence mode="popLayout">
                      {theme === 'dark' ? (
                        <motion.div key={1} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <SunIcon />
                        </motion.div>
                      ) : (
                        <motion.div key={2} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <MoonIcon />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </button>
                
              </div> */}

              <button className={`${props.active ? 'active' : ''} toggler d-xl-none`} onClick={props.handleActive}>
                {theme === 'light' ? <LightMenu /> : <Menu />}
              </button>
            </div>
          </div>
        </Container>
      </header>
      <ConnectWallet show={show} handleClose={() => setShow(false)} />
    </>
  )
}

export default Header
