chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  this.isActive = chrome.tabs.sendMessage(tabs[0].id, {});
});
window.close();