let isLoaded = false;

chrome.runtime.onMessage.addListener(config => {
    if (!isLoaded) {
        appendCss("main.css");
        appendScript("main.js");
        isLoaded = true;
        chrome.runtime.sendMessage({ "isActive": true });
    } else {
        const el = document.getElementById("cd-wrapper");
        const isActive = el.style.display === 'none';
        el.style.display = isActive ? '' : 'none';
        chrome.runtime.sendMessage({ "isActive": isActive });
    }

});

function appendCss(url) {
    let el = document.createElement('link');
    el.href = chrome.extension.getURL(url);
    el.rel = 'stylesheet';
    el.type = 'text/css';
    let h = document.getElementsByTagName('head')[0];
    h.appendChild(el);
};

function appendScript(url) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', chrome.extension.getURL(url), true);
    xhr.onload = e => {
        if (xhr.status === 200)
            eval(xhr.responseText);
    };
    xhr.send();
};