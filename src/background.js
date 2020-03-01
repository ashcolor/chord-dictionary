let activeTabIds = [];

//アイコンをクリックされたとき
chrome.runtime.onMessage.addListener(function (message) {
    setStatus(message.isActive)
});

//タブが更新されたとき
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    setStatus(false)
});

//アクティブなタブが変更されたとき
chrome.tabs.onActivated.addListener(function (activeInfo) {
    setStatus();
});

function setStatus(isActive = null) {
    chrome.tabs.getSelected(null, function (tab) {
        if (isActive) {
            activeTabIds.push(tab.id);
        } else if (isActive === false) {
            activeTabIds = activeTabIds.filter(n => n !== tab.id);

        }
        isActive = activeTabIds.indexOf(tab.id) !== -1
        console.log("setStatus -> tab.id", tab.id)
        console.log("setStatus -> activeTabIds", activeTabIds)
        chrome.browserAction.setBadgeText({ text: isActive ? "ON" : "" });

    });

}
