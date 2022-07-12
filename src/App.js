  //サイトの表側を司るコード
import React, {useEffect, useState} from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/sagitaPortal.json";
import fetch from 'node-fetch';
require("dotenv").config();


const App = () => {
  // ユーザーのパブリックウォレットを保存するために使用する状態変数を定義する
  //currentAccountという変数をsetCurrentAccountという関数を使って変えますよという宣言
  //{x}で値を支える
  const [currentAccount, setCurrentAccount] = useState("");
  console.log("currentAccount: ", currentAccount);
  const [messageValue, setMessageValue] = useState("")
  const [allEdges, setAllEdges] = useState([]);
  const contractABI = abi.abi;
  const [VLANfts, setVLANfts] = useState([]);

//保有nft検索回り
// const fetch = require('node-fetch');
//const CONTRACT = process.env.CONTRACT_ADDRESS;
const CONTRACT = "0x2953399124f0cbb46d2cbacd8a89cf0599974963";
// const AUTH = process.env.NFTPORT_AUTH;
const AUTH = process.env.REACT_APP_NFTPORT_AUTH_KEY;
console.log("auth",AUTH);
const chain = "polygon";
const include = "metadata";




  const checkIfWalletIsConnected = async () => { 
    //window.ethereumにアクセスできることを確認する
    try {
    const {ethereum} = window;
    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum); 
    }
    //ユーザーのウォレットへのアクセス許可を確認
    const accounts = await ethereum.request({ method: "eth_accounts" }); 
    if (accounts.length !==  0) {
      const account = accounts[0]; 
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      await getVLANfts(account);
    
    } else {
      console.log("No authorized account found")
    }
  } catch (error) {
    console.log(error);
  }
};

//connectWallet メソッドの実装
const connectWallet = async () => {
  try {
    const {ethereum} = window;
    if (!ethereum) {
      alert("Get MetaMask!");
      return;
    }
    const accounts = await ethereum.request({method: "eth_requestAccounts"});
    console.log("Connected: ", accounts[0]);
    setCurrentAccount(accounts[0]); 
    await getVLANfts(accounts[0]);
    
  } catch (error) {
    console.log(error)
  }
}


//nftを取得する
const getVLANfts = async (wallet) => {
  const page = 50;
  const url_main = 'https://api.nftport.xyz/v0/accounts/' + wallet + '?chain=polygon';
  
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: AUTH,
    }
  };
  
  try {
    let data = await fetchData(url_main, options);
    let All_nfts =data.nfts;
    let continuation = data.continuation;
    while (continuation != null){
      let url = url_main + "&continuation=" + continuation;
      data = await fetchData(url, options);
      All_nfts = All_nfts.concat(data.nfts);
      continuation = data.continuation;
    }
    console.log("date:", data);
   
    const total = All_nfts.length;
    console.log("total", total);

    const ipfschecker = async (nft) => {
      let image_url = "";
      if (nft.file_url.match("ipfs://")){
        image_url = "https://ipfs.io/ipfs/" + nft.file_url.substring(7);
        return image_url
      } else {
        return nft.file_url
      }
    }

    All_nfts.forEach(nft => {
      if(nft.name.match("very") || nft.name.match("long") || nft.name.match("animals") || nft.name.match("Animals") || nft.name.match("Very")|| nft.name.match("Long") || nft.name.match("ベリ")　|| nft.name.match("ロン")) {
        if (nft.contract_address=="0xC52d9642260830055c986a97794B7b27393Edf5e"){
          let image_url = "";
      if (nft.file_url.match("ipfs://")){
        image_url = "https://ipfs.io/ipfs/" + nft.file_url.substring(7);
       
      } else {
        image_url = nft.file_url;
      }
          setVLANfts(prevState => [
            ...prevState,
            {"name": nft.name, "image_url": image_url, "genesis_flag":5}
          ]);
       
        }
        else{
          let image_url = "";
          if (nft.file_url.match("ipfs://")){
            image_url = "https://ipfs.io/ipfs/" + nft.file_url.substring(7);
           
          } else if (nft.file_url.match("ipfs:/")) {
            image_url = "https://ipfs.io/ipfs/" + nft.file_url.substring(6);
          }
          else {
            image_url = nft.file_url;
          }
      
          setVLANfts(prevState => [
            ...prevState,
            {"name": nft.name, "image_url": image_url, "genesis_flag":2}
          ]);
        
        }
      }
    })


    return 
      //next_page: +page === pages ? null : +page + 1,

  } catch(err) {
    console.log(`Catch: ${JSON.stringify(err)}`)
    return {
      error: err
    }
  }
}

async function fetchData(url, options) {
  try {
    const res = await fetch(url, options);
    if (res.status != 200){
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const text = await res.json();
    console.log(text);
    return text;
  } catch (err) {
    console.error(err);
  }
}

// //edgeを追加する関数を実装
// //投票する関数を実装
// const approve = async(index) => {
//   try {
//     const {ethereum} = window;
//     if (ethereum) {
//       const provider = new ethers.providers.Web3Provider(ethereum);
//       const signer = provider.getSigner();
//       const sagitaPortalContract = new ethers.Contract(contractAddress,  contractABI, signer);
//       // let count = await sagitaPortalContract.getTotalWaves();
//       let contractBalance = await provider.getBalance( 
//         sagitaPortalContract.address);
//       //   console.log(
//       //     "Contract balance:", 
//       //     ethers.utils.formatEther(contractBalance)
//       //   );
//       // console.log("Retrieved total wave count...", count.toNumber());
//       console.log("Signer:",signer);    
//       //コントラクトにwaveを書き込む
//       const approveTxn = await sagitaPortalContract.approve(index, {gasLimit:300000});
//       console.log("Mining...", approveTxn.hash);
//       await approveTxn.wait();
//       console.log("Minted --", approveTxn.hash);
//       // count = await sagitaPortalContract.getTotalWaves();
//       // console.log("Retrieved total wave count ...", count.toNumber()) ;
//       let contractBalance_post = await provider.getBalance(sagitaPortalContract.address);
//       if (contractBalance_post < contractBalance){
//         console.log("User won ETH!");
//       } else {
//         console.log("User didn't win Eth.");
//       }
//       console.log(
//         "contract balance after approval",
//         ethers.utils.formatEther(contractBalance_post)
//       );
//       getAllEdges();
//       visualize();
//     } else {
//       console.log("Ethereum object doesn't exist!");
//     }
//   } catch (error) {
//   console.log(error)
//   } 
// }
  
// webページがロードされた時、実行する関数
  useEffect(() => {

//    getAllEdges();

      checkIfWalletIsConnected();  
    
      // const a = await getVLANfts(currentAccount);
    // console.log("a:",a);
    // console.log("ownedNFT", owned_NFT);åß
    
  }, []) 
  return (

    <div className="mainContainer">
       <div className="fixed left-0 right-0 bg-white z-10">
         <div className="mx-auto max-w-7xl px-2 lg:px-4">
       <header className="flex flex-col lg:flex-row lg:items-center lg:h-20">
       <div className="flex items-center h-14"><div className="flex flex-grow"><a className="flex items-center" href="/">
      Your VLA Portal
       </a>
       </div>
       </div>
               <div className="ml-auto flex items-center"><nav className="hidden lg:flex space-x-10 ml-4 items-center"><a className="text-base font-medium text-gray-500 hover:text-gray-900" href="/test">test</a><a className="text-base font-medium text-gray-500 hover:text-gray-900" href="/test">test</a>
               <div>Chain: <b>Polygon</b></div>
               <div>
                  {/* ウォレットコネクトボタンの実装*/}
        {!currentAccount &&  (
          <button className="mx-auto justify-center py-2 px-4 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md border border-transparent" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        {currentAccount && (
          <button className="mx-auto justify-center py-2 px-4 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md border border-transparent" onClick={connectWallet}>
            Wallet Connected
          </button>
        )}</div></nav></div></header></div></div>
      <div className="dataContainer">
        <div className="text-lg mb-1">
       VLA portalとは？？
        </div>
        <div className="text-gray-400 text-sm bio">
          VLA PortalではあなたのVLA関係のNFT一覧が見れるよ！！自分のギャラリーをツイートしよう！！
        </div>
        {/* <button className="waveButton" onClick={wave}>
          approve
        </button> */}
       
        {/* メッセージボックスを実装
        {currentAccount && (<textarea name="messageArea"
        placeholder="メッセージはこちら"
        type="text"
        id="message"
        value={messageValue}
        onChange={e => setMessageValue(e.target.value)}/>)} */}
        <h2 className="text-lg mb-1">Your VLA Gallary</h2>
        <p className="text-gray-400 text-sm"></p>
        {/*VLAの画像一覧を表示*/}
        <ul className="gallery__list">
        {currentAccount && (
          VLANfts.map((nft) => {
            return (
              <li class="gallery__item">
              <a href={nft.image_url} data-lightbox="group1" data-title={nft.name}>
                  <img src={nft.image_url} alt=""/>
                  {nft.name}
              </a>
              </li>
            )
          })
        )}
        </ul>
     
      </div>
     
    </div>
  );
}
export default App


// export default function App() {

//   const wave = () => {

//   }

//   return (
//     <div className="mainContainer">

//       <div className="dataContainer">
//         <div className="header">
//         <span role="img" aria-label="hand-wave">👋</span> WELCOME!
//         </div>

//         <div className="bio">
//         イーサリアムウォレットを接続して、メッセージを作成したら、<span role="img" aria-label="hand-wave">👋</span>を送ってください<span role="img" aria-label="shine">✨</span>
//         </div>

//         <button className="waveButton" onClick={wave}>
//         Wave at Me
//         </button>
//       </div>
//     </div>
//   );
// }
