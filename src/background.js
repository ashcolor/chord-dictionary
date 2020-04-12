let activeTabIds = {};

//アイコンがクリックされたとき
chrome.browserAction.onClicked.addListener(function (tab) {
  const tabId = tab.id;
  if (tabId == -1) return;
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

//タブが更新されたとき
chrome.tabs.onUpdated.addListener(setStatus);

//ページがリロードされたとき
chrome.runtime.onMessage.addListener(function (message, sender) {
  if (message == "reload") delete activeTabIds[sender.tab.id];
});

//アクティブなタブが変更されたとき
chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.browserAction.setBadgeText({ text: activeTabIds[activeInfo.tabId] ? "ON" : "" });
});

//アクティブなウィンドウが変更されたとき
chrome.windows.onFocusChanged.addListener(setStatus);

function setStatus() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.browserAction.setBadgeText({ text: tabs[0] && activeTabIds[tabs[0].id] ? "ON" : "" });
  });
}