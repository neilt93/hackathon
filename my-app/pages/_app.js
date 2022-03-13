import 'tailwindcss/tailwind.css'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }) {
	const [currentAccount, setCurrentAccount] = useState('')
	const [correctNetwork, setCorrectNetwork] = useState(false)
	const [dropdownOpen, setDropdownOpen] = useState(false)

	const router = useRouter()

	const pages = [
		{
			name: 'Home',
			path: '/',
		},
		{
			name: 'Mint',
			path: '/mint',
		},
		{
			name: 'My NFTs',
			path: '/mynft',
		},
	]

	const checkIfWalletIsConnected = async () => {
		const { ethereum } = window
		if (ethereum) {
			console.log('Got the ethereum obejct: ', ethereum)
		} else {
			console.log('No Wallet found. Connect Wallet')
		}

		const accounts = await ethereum.request({ method: 'eth_accounts' })

		if (accounts.length !== 0) {
			console.log('Found authorized Account: ', accounts[0])
			setCurrentAccount(accounts[0])
		} else {
			console.log('No authorized account found')
		}
	}

	const connectWallet = async () => {
		try {
			const { ethereum } = window

			if (!ethereum) {
				console.log('Metamask not detected')
				return
			}
			let chainId = await ethereum.request({ method: 'eth_chainId' })
			console.log('Connected to chain:' + chainId)

			const rinkebyChainId = '0x4'

			const devChainId = 1337
			const localhostChainId = `0x${Number(devChainId).toString(16)}`

			if (chainId !== rinkebyChainId && chainId !== localhostChainId) {
				alert('You are not connected to the Rinkeby Testnet!')
				return
			}

			const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

			console.log('Found account', accounts[0])
			setCurrentAccount(accounts[0])
		} catch (error) {
			console.log('Error connecting to metamask', error)
		}
	}

	const checkCorrectNetwork = async () => {
		const { ethereum } = window
		let chainId = await ethereum.request({ method: 'eth_chainId' })
		console.log('Connected to chain:' + chainId)

		const rinkebyChainId = '0x4'

		const devChainId = 1337
		const localhostChainId = `0x${Number(devChainId).toString(16)}`

		if (chainId !== rinkebyChainId && chainId !== localhostChainId) {
			setCorrectNetwork(false)
		} else {
			setCorrectNetwork(true)
		}
	}

	useEffect(() => {
		checkIfWalletIsConnected()
		checkCorrectNetwork()
	}, [])

	return (
		<div className='bg-gray-100 h-full min-h-screen'>
			{currentAccount === '' ? (
				<div className='flex flex-col justify-center items-center pt-36 gap-y-12'>
					<div className='hover:scale-105 transition duration-500 ease-in-out'>
					</div>
					<div className='text-5xl text-red-500 font-mono '>
						Welcome to the Ancient Realm
					</div> <div />
					<button
						className='text-2xl font-bold py-3 px-12 bg-red-500 text-gray-100 shadow-xl rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
						onClick={connectWallet}
					>
						Connect Wallet
					</button>
				</div>
		) : correctNetwork ? (
			<div>
				<div className='flex justify-between items-center pt-6 pb-4 px-20 shadow-xl'>
					<Link href='/'>
						<div className='flex gap-x-4 font-mono text-3xl cursor-pointer'>
							<div className='trasition hover:rotate-180 hover:scale-105 transition duration-500 ease-in-out'>
							</div>
							<div className='text-1xl text-red-500 font-mono '>
								Ancient Realm
							</div>
						</div>
					</Link>

					<div className='dropdown relative flex gap-x-12 text-xl font-bold '>
						{pages.map((page, i) => (
							<Link key={i} href={page.path}>
								<div
									className={`flex items-center justify-center rounded-full cursor-pointer transition duration-500 ease-in-out h-12 w-24 hover:bg-red-500 hover:text-gray-100 hover:shadow-xl ${
										router.asPath === page.path
											? 'bg-red-500 text-gray-100 shadow-xl'
											: ''
									}`}
								>
									{page.name}
								</div>
							</Link>
						))}
						<button
							onClick={() =>
								dropdownOpen ? setDropdownOpen(false) : setDropdownOpen(true)
							}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='32'
								height='32'
								fill='currentColor'
								viewBox='0 0 16 16'
							>
								<path d='M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z' />
								<path
									fillRule='evenodd'
									d='M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z'
								/>
							</svg>
						</button>
						<div
							className={`dropdown-menu absolute h-8 px-2 right-0 top-20 rounded-full bg-gray-800 text-gray-200 ${
								dropdownOpen ? 'block' : 'hidden'
							}`}
						>
							Connected : <span>{currentAccount.slice(0, 8)}</span>...
						</div>
					</div>
				</div>
				<Component {...pageProps} />
			</div>
			) : (
				<div className='flex flex-col justify-center items-center pt-40 font-bold text-2xl gap-y-3'>
					<div>----------------------------------------</div>
					<div>Please connect to the Rinkeby Testnet</div>
					<div>and reload the page</div>
					<div>----------------------------------------</div>
				</div>
			)}
		</div>
	)
}

export default MyApp
