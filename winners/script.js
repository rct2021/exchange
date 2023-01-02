function getUrl(start = 0) {
    return 'https://api.coinlore.com/api/tickers/?start=' +  start + '&limit=10';
}
function getData(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => loadDataIntoTable(data))
        .catch(err => console.log(err));
}

function loadDataIntoTable(data) {
    let coinName = [];
    let coinSymbol = [];
    let coinRank = [];
    let coinPrice = [];
    let coin24Change = [];
    let coin7Change = [];
    let coin30Change = [];

    data['data'].forEach((coin) => {
        coinName.push(coin.name);
        coinSymbol.push(coin.symbol);
        coinRank.push(coin.rank);
        coinPrice.push(coin.price_usd);
        coin24Change.push(coin.percent_change_24h);
      coin7Change.push(coin.percent_change_7d);
    });

    let tableBody = document.getElementById('crypto-table-body');

    let html = "";

    for(let i = 0; i < coinName.length; i++) {
        html += "<tr>";
        html += "<td>" + coinName[i] + " (" + coinSymbol[i] + ")" + "</td>";
        html += "<td>" + coinRank[i] + "</td>";
        html += "<td>$" + coinPrice[i] + "</td>";
        if (coin24Change[i] > 0) {
            html += "<td class='green-text text-darken-4'>+" + coin24Change[i] + "%</td>";
        } else {
            html += "<td class='red-text text-darken-4'>" + coin24Change[i] + "%</td>";
        }
          //row of 7 day change
          
          if (coin7Change[i] > 0) {
            html += "<td class='green-text text-darken-5'>+" + coin7Change[i] + "%</td>";
        } else {
            html += "<td class='red-text text-darken-4'>" + coin7Change[i] + "%</td>";
        }
        
        html += "</tr>";
    }

    tableBody.innerHTML = html;
}

function handleNumberClick(clickedLink, leftArrow, rightArrow) {
    clickedLink.parentElement.classList = "active";
    let clickedLinkPageNumber = parseInt(clickedLink.innerText);
    const url = getUrl((clickedLinkPageNumber * 10) - 10);
    getData(url);

    switch(clickedLinkPageNumber) {
        case 1:
            disableLeftArrow(leftArrow);
            if (rightArrow.className.indexOf('disabled') !== -1) {
                enableRightArrow(rightArrow);
            }
            break;
        case 10:
            disableRightArrow(rightArrow);
            if (leftArrow.className.indexOf('disabled') !== -1) {
                enableLeftArrow(leftArrow);
            }
            break;
        default:
            if (leftArrow.className.indexOf('disabled') !== -1) {
                enableLeftArrow(leftArrow);
            }
            if (rightArrow.className.indexOf('disabled') !== -1) {
                enableRightArrow(rightArrow);
            }
            break;
    }
}

function handleLeftArrowClick(activePageNumber, leftArrow, rightArrow) {
    //move to previous page
    let previousPage = document.querySelectorAll('li')[activePageNumber-1];
    previousPage.classList = "active";
    url = getUrl(((activePageNumber-1) * 10) - 10);
    getData(url);
    
    if (activePageNumber === 10) {
        enableRightArrow(rightArrow);
    }

    if (activePageNumber - 1 === 1) {
        disableLeftArrow(leftArrow);
    }
}

function handleRightArrowClick(activePageNumber, leftArrow, rightArrow) {
    //move to next page
    let nextPage = document.querySelectorAll('li')[activePageNumber+1];
    nextPage.classList = "active";

    url = getUrl(((activePageNumber+1) * 10) - 10);
    getData(url);

    if (activePageNumber === 1) {
        enableLeftArrow(leftArrow);
    }

    if (activePageNumber + 1 === 10) {
        disableRightArrow(rightArrow);
    }
}

function disableLeftArrow(leftArrow) {
    leftArrow.classList = "disabled arrow-left";
}

function enableLeftArrow(leftArrow) {
    leftArrow.classList = "waves-effect arrow-left";
}

function disableRightArrow(rightArrow) {
    rightArrow.classList = "disabled arrow-right";
}

function enableRightArrow(rightArrow) {
    rightArrow.classList = "waves-effect arrow-right";
}

function init() {
    const url = getUrl();
    getData(url);
}

init();

//handle pagination
let pageLinks = document.querySelectorAll('a');
let activePageNumber;
let clickedLink;
let leftArrow;
let rightArrow;
let url = '';

pageLinks.forEach((element) => {
    element.addEventListener("click", function() {
        leftArrow = document.querySelector('.arrow-left');
        rightArrow = document.querySelector('.arrow-right');
        console.log(rightArrow);
        activeLink = document.querySelector('.active');

        //get active page number 
        activePageNumber = parseInt(activeLink.innerText);

        if ((this.innerText === 'chevron_left' && activePageNumber === 1) || (this.innerText === 'chevron_right' && activePageNumber === 10)) {
            return;
        }

        //update active class
        activeLink.classList = "waves-effect";

        if (this.innerText === 'chevron_left') {
            handleLeftArrowClick(activePageNumber, leftArrow, rightArrow);
        } else if (this.innerText === 'chevron_right') {
            handleRightArrowClick(activePageNumber, leftArrow, rightArrow);
        } else {
            handleNumberClick(this, leftArrow, rightArrow);
        }

    });
});


