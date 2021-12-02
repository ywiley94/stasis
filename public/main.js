const serverUrl = "https://dmxq2ygvqugv.usemoralis.com:2053/server";
const appId = "lDdw0E0PIXVhIinYPibBo7XgZU9YTiLZl2G1F8JM";

Moralis.start({ serverUrl, appId });





//fetch call to etherscan\

async function getAddressBalance() {
  const address = "0x426Aed380050e47146bF8750cAa9bd51a59bFB4A";
  const url = `https://api.etherscan.io/api?module=account&action=balance&address=0x426Aed380050e47146bF8750cAa9bd51a59bFB4A&tag=latest&apikey=Z8UREQ5A9G5TGXUBHJ8UGXCQUNP9ZBN5JX`;

  fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    return response.json();
  })
  .then(data => {
    console.log(data.result);
    document.getElementById("ethBalance").innerHTML = `ETH = .${data.result}`
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });

}
getAddressBalance()

//fetch call to opensea for assets


async function getNFTs() {
  const options = {method: 'GET'};
  const url = `https://api.opensea.io/api/v1/assets?order_direction=desc&offset=10&limit=20`
  fetch(url, options)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    return response.json();
  })
  .then(data => {
    // console.log(data.assets);
    let results = data;
    show(results);
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });

}
getNFTs()



function show(results) {
  let card = ``;
  

  for(let asset in results.assets){
    // console.log(results.assets[asset])
    let creater = results.assets[asset].creator;
    for(let i in creater) {

      // console.log(creater.user.username)
      card += `<div class="card mb-4">
      <div class="card-body">
        <div class="media mb-3">
          <img id="cryptoImg" src=${results.assets[asset].image_url} class="d-block ui-w-40 rounded-circle" alt="">
          <div id="cryptoUser" class="media-body ml-3">
          <strong>Creator - </strong>
            ${creater.user.username}
          <strong>Address - </strong>
            ${creater.address}
            <div class="text-muted small">3 days ago</div>
          </div>
        </div>
    
        <p>
        ${results.assets[asset].description}
        </p>
        <a href="javascript:void(0)" class="ui-rect ui-bg-cover" style="background-image: url('https://bootdey.com/img/Content/avatar/avatar3.png');"></a>
      </div>
      <div class="card-footer">
        <span id="likes" class="likes d-inline-block">
            <strong>1</strong> Likes</small>
        </span>
        
        <a href=${results.assets[asset].permalink} class="d-inline-block btn btn-primary ml-3">
          <small class="align-middle">Buy Now</small>
        </a>
      </div>
    </div>`;
    document.getElementById("displayNfts").innerHTML = card

    }

  }  
  
  }


    
// initiaite plugins
(async function(){
  Moralis.initPlugins();
})();


// Buy crypto iframe
function buycrypto() {
  Moralis.Plugins.fiat.buy();
}
async function iframefiat() {
  let result = await Moralis.Plugins.fiat.buy(undefined, {disableTriggers: true})
  console.log(result)
  document.getElementById("myIframe").style.display = "block";
  document.getElementById("myIframe").src = result.data;
}

// Get User Balances
function getBalances() {
  const user = Moralis.User.current();
  if(user) {
    getUserBalances(user)
  }
}

async function getUserBalances(user) {
  const options = {address: '0x6a0B823334E60b4397571dA977F221c928f98146'}
  const balances = await Moralis.Web3API.account.getTokenBalances(user);
  const results = balances
  console.log("User's Balances" + results)
}
getBalances();



// Get Users
function getStats() {
  const user = Moralis.User.current();
  console.log(user)
  if (user) {
    getUserTransactions(user);
  }
}

async function getUserTransactions(user) {
  // create query
  const query = new Moralis.Query("EthTransactions");
  query.equalTo("from_address", user.get("ethAddress"));

  // run query
  const results = await query.find();
  console.log("user transactions:", results);
}

// get stats on page load
getStats();


/* Authentication code */
async function login() {
  let user = Moralis.User.current();
  const query = new Moralis.Query("EthTransactions");
  if (!user) {
    user = await Moralis.authenticate({ signingMessage: "Log in using Moralis" })
      .then(function (user) {
        console.log("logged in user:", user);
        console.log(user.get("ethAddress"));
        window.location.href="/dashboard"
      })
      .catch(function (error) {
        console(error);
      });
  }
}

async function logOut() {
  await Moralis.User.logOut();
  console.log("logged out");
}


document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logOut;
document.getElementById("buyCrypto").onclick = iframefiat;






