// ==UserScript==
// @name        Event Detail Concealer (by @Mariam05)
// @namespace   gcal-event-concealer
// @include     https://www.google.com/calendar/*
// @include     http://www.google.com/calendar/*
// @include     https://calendar.google.com/*
// @include     http://calendar.google.com/*
// @version     1
// @grant       none
// ==/UserScript==

'use strict';


const merge = (mainCalender) => {
    const eventSets = {};
    const days = mainCalender.querySelectorAll("[role=\"gridcell\"]");
    days.forEach((day, index) => {
        const events = Array.from(day.querySelectorAll("[data-eventid][role=\"button\"], [data-eventid] [role=\"button\"]"));
        events.forEach(event => {
            const eventTitleEls = event.querySelectorAll('[aria-hidden="true"]');
            eventTitleEls.forEach(elem => {
                elem.style.visibility = "hidden";
            });
        });
    });
}

const init = (mutationsList) => {
    mutationsList && mutationsList
        .map(mutation => mutation.addedNodes[0] || mutation.target)
        .filter(node => node.matches && node.matches("[role=\"gridcell\"], [role=\"main\"], [role=\"dialog\"], [role=\"grid\"]"))
        .map(merge);
}

setTimeout(() => chrome.storage.local.get('disabled', storage => {
    console.log(`Event merge is ${storage.disabled ? 'disabled' : 'enabled'}`);
    if (!storage.disabled) {
        const observer = new MutationObserver(init);
        observer.observe(document.querySelector('body'), { childList: true, subtree: true, attributes: true });
    }

    chrome.storage.onChanged.addListener(() => window.location.reload())
}), 10);
