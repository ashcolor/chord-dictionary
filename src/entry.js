let isLoaded = false;

chrome.runtime.onMessage.addListener(config => {
    if (!isLoaded) {
        appendCss("main.css");
        appendScript("main.js");
        isLoaded = true;
    } else {
        const el = document.getElementById("cd-wrapper");
        el.style.display = el.style.display === 'none' ? '' : 'none';
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