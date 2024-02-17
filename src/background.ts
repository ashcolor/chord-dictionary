// const activeTabIds = {};
// let error;

// const checkError = () => {
//     error = chrome.runtime.lastError;
// };

// const setStatus = () => {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         chrome.action.setBadgeText({ text: tabs[0] && activeTabIds[tabs[0].id] ? "ON" : "" });
//     });
// };

//アイコンがクリックされたとき
// chrome.action.onClicked.addListener((tab) => {
//     const tabId = tab.id;
//     if (tabId === -1) return;
//     if (!(tabId in activeTabIds)) {
//         chrome.scripting.executeScript({
//             target: { tabId: tabId },
//             files: [mainJs],
//         });
//         activeTabIds[tabId] = true;
//         chrome.action.setBadgeText({ text: "ON" });
//     } else {
//         const isActiveTo = !activeTabIds[tabId];
//         chrome.tabs.sendMessage(tabId, { isActive: isActiveTo });
//         chrome.action.setBadgeText({ text: isActiveTo ? "ON" : "" });
//         activeTabIds[tabId] = isActiveTo;
//     }
// });

//タブが更新されたとき
// chrome.tabs.onUpdated.addListener(setStatus);

//ページがリロードされたとき
// chrome.runtime.onMessage.addListener((message, sender) => {
//     if (message == "reload") delete activeTabIds[sender.tab.id];
// });

//アクティブなタブが変更されたとき
// chrome.tabs.onActivated.addListener((activeInfo) => {
//     chrome.action.setBadgeText({ text: activeTabIds[activeInfo.tabId] ? "ON" : "" });
// });

//アクティブなウィンドウが変更されたとき
// chrome.windows.onFocusChanged.addListener(setStatus);
