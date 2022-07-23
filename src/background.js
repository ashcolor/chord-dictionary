let activeTabIds = {};
let error;

const checkError = () => {
    error = chrome.runtime.lastError;
};

//アイコンがクリックされたとき
chrome.action.onClicked.addListener((tab) => {
    const tabId = tab.id;
    if (tabId === -1) return;
    if (!(tabId in activeTabIds)) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["main.js"],
        });
        chrome.scripting.insertCSS(
            {
                target: { tabId: tabId },
                files: ["main.css"],
            },
            checkError
        );
        chrome.scripting.insertCSS(
            {
                target: { tabId: tabId },
                css:
                    '@font-face { font-family: "FreeSerif"; src: url("' +
                    chrome.runtime.getURL("assets/FreeSerif.ttf") +
                    '"), url("' +
                    chrome.runtime.getURL("assets/FreeSerif.otf") +
                    '"); unicode-range: U+266D-266F, U+1D12A-1D12B; }',
            },
            checkError
        );
        activeTabIds[tabId] = true;
        chrome.action.setBadgeText({ text: "ON" });
    } else {
        const isActiveTo = !activeTabIds[tabId];
        chrome.tabs.sendMessage(tabId, { isActive: isActiveTo });
        chrome.action.setBadgeText({ text: isActiveTo ? "ON" : "" });
        activeTabIds[tabId] = isActiveTo;
    }
});

//タブが更新されたとき
chrome.tabs.onUpdated.addListener(setStatus);

//ページがリロードされたとき
chrome.runtime.onMessage.addListener((message, sender) => {
    if (message == "reload") delete activeTabIds[sender.tab.id];
});

//アクティブなタブが変更されたとき
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.action.setBadgeText({ text: activeTabIds[activeInfo.tabId] ? "ON" : "" });
});

//アクティブなウィンドウが変更されたとき
chrome.windows.onFocusChanged.addListener(setStatus);

const setStatus = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.action.setBadgeText({ text: tabs[0] && activeTabIds[tabs[0].id] ? "ON" : "" });
    });
};
