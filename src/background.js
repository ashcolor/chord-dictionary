let activeTabIds = [];

//アイコンをクリックされたとき
chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs.length === 0) return false;
        const tabId = tabs[0].id;
        if (!(tabId in activeTabIds)) {
            chrome.tabs.executeScript(tabId, { file: "main.js" });
            chrome.tabs.insertCSS(tabId, { file: "main.css" });
            activeTabIds[tabId] = true;
            chrome.browserAction.setBadgeText({ text: "ON" });
        } else {
            const isActiveTo = !activeTabIds[tabId];
            chrome.tabs.sendMessage(tabId, { isActive: isActiveTo });
            chrome.browserAction.setBadgeText({ text: isActiveTo ? "ON" : "" });
            activeTabIds[tabId] = isActiveTo;
        }
    });
});

// //タブが更新されたとき
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status !== "complete") return false
    delete activeTabIds[tabId];
    setStatus()
});

// //アクティブなタブが変更されたとき
chrome.tabs.onActivated.addListener(function (activeInfo) {
    setStatus();
});

function setStatus() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs.length === 0) return false;
        const tabId = tabs[0].id;
        const isActive = tabId in activeTabIds ? activeTabIds[tabId] : false;
        chrome.browserAction.setBadgeText({ text: isActive ? "ON" : "" });
    });
}
