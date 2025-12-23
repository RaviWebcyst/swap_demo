import { useAppDispatch, useAppSelector } from '../../../../../app/hooks'
import Button from '../../../Button/Button'
import {
  ATMCardIcon,
  CloseIcon,
  LogoutIcon,
  SettingSecIcon,
  Wallet,
  WalletIcon,
} from '../../../../../assets/icons/svgicons'


import icon from '../../../../../assets/icons/favicon.png'


import './ViewWallet.scss'

import {
  resetUserSlice,
  setSolanaWalletAddress,
  setUserConnected,
  setWalletAddress,
} from '../../../../../features/theme/user.slice'
import { customizeAddress } from '../../../../../utils/helpers'
import { useAppKit, useAppKitAccount, useDisconnect, useWalletInfo } from '@reown/appkit/react'



const ViewWallet = ({ logoutOnCick, justClose, address }: any) => {
  const { solanawalletAddress }: { solanawalletAddress: any } = useAppSelector((store: any) => store?.user)

  var wallet = useWalletInfo()
  var { walletInfo } = useWalletInfo('solana')
  var { walletInfo: evmWallet } = useWalletInfo('eip155')
  const { open } = useAppKit()

  const { theme } = useAppSelector((state) => state.theme)
  const dispatch = useAppDispatch()


  const { disconnect } = useDisconnect()

  const handleDisconnect = async () => {

    await disconnect({ namespace: 'eip155' })

    dispatch(setWalletAddress(''))
    justClose()

  }

  const handleDisconnectSolana = async () => {
    await disconnect({ namespace: 'solana' })
    dispatch(setSolanaWalletAddress(''))
    justClose()
  }

  return (
    <>
      <section className="viewWallet">
        <button className="croseBtn" onClick={() => justClose()}>
          <CloseIcon />
        </button>
        <div className="d-grid gap-3">
          {address && (
            <div className="viewWallet_tophead evm">
              <div className="viewWallet_tophead_connectIcon">
                {/* <img src={icon} alt="rezorIcon" /> */}

                {evmWallet?.name == 'Browser Wallet' ? (
                  <div className="bg-light border rounded-circle p-2 ">
                    <Wallet />{' '}
                  </div>
                ) : (
                  <img src={evmWallet?.name == 'Rezor' ? icon : evmWallet?.icon} alt="rezorIcon" />
                )}
                {/* <span className="walletIcon">
              <img src={metamask} alt="wallet" />
            </span> */}
                <h6>{customizeAddress(address || '')}</h6>
              </div>
              <div className="viewWallet_tophead_rightBtn">
                <Button className="without_bg_border btnlogout" onClick={() => handleDisconnect}>
                  <LogoutIcon />
                  <span className="d-flex align-items-center" onClick={() => handleDisconnect()}>
                    <LogoutIcon /> Disconnect
                  </span>
                </Button>
              </div>
            </div>
          )}
          {solanawalletAddress && (
            <div className="viewWallet_tophead solana">
              <div className="viewWallet_tophead_connectIcon">
                {/* <img src={icon} alt="rezorIcon" /> */}
                <img src={walletInfo?.icon} alt="rezorIcon" />
                {/* <span className="walletIcon">
               <img src={metamask} alt="wallet" />
             </span> */}
                <h6>{customizeAddress(solanawalletAddress || '')}</h6>
              </div>
              <div className="viewWallet_tophead_rightBtn">
                <Button className="without_bg_border btnlogout" onClick={() => handleDisconnectSolana()}>
                  <LogoutIcon />
                  <span className="d-flex align-items-center" onClick={() => handleDisconnectSolana}>
                    <LogoutIcon /> Disconnect
                  </span>
                </Button>
              </div>
            </div>
          )}

          
              <div className="connect_btn d-flex justify-content-center mt-3">
                {' '}
                <Button
                className="h-100 p-3 px-4"
                  onClick={() => {
                    open({ view: 'Connect' })
                  }}
                >
                  Connect Another Wallet
                </Button>
              </div>
          
        </div>
      </section>
    </>
  )
}

export default ViewWallet
