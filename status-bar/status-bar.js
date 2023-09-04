const followerCounter = document.getElementById('followerCounter');
const subCounter = document.getElementById('subCounter');
const console = document.getElementById('console');

let followers = 0;
let subs = 0;

const checkPrivileges = (data, privileges) => {
    const {tags, userId} = data;
    const {mod, subscriber, badges} = tags;
    const required = privileges;
    const isMod = parseInt(mod);
    const isSub = parseInt(subscriber);
    const isVip = (badges.indexOf("vip") !== -1);
    const isBroadcaster = (userId === tags['room-id']);
    if (isBroadcaster) return true;
    if (required === "justSubs" && isSub) return true;
    if (required === "mods" && isMod) return true;
    if (required === "vips" && (isMod || isVip)) return true;
    if (required === "subs" && (isMod || isVip || isSub)) return true;
    return required === "everybody";
};

/* Widget Initalization */
window.addEventListener('onWidgetLoad', async obj => {
    const sessionData = obj.detail.session.data;
    followers = sessionData['follower-total'].count;
    subs = sessionData['subscriber-total'].count
    followerCounter.innerHTML = followers;
    subCounter.innerHTML = subs;
})

const onMessage = (event) => {
    const data = event.data;
    const text = data.text;

    if (!checkPrivileges(data, 'broadcaster')) {
        return;
    }

    const startsWithCommand = text.toLowerCase().startsWith('!console');

    if(!startsWithCommand){
        return;
    }

    const consoleName = text.replace('!console', '').trim().toUpperCase();
    console.innerHTML = consoleName;
};

const onFollower = () => {
    followers += 1;
    followerCounter.innerHTML = followers;
};

const onSubscriber = (event) => {
    subs += event.amount;
    subCounter.innerHTML = subs;
};

/* Use Events */
const eventListenerToHandlerMap = {
    message: onMessage,
    'follower-latest': onFollower,
    'subscriber-latest': onSubscriber,
};

window.addEventListener('onEventReceived', obj => {
    const {listener, event} = obj?.detail || {};
    const handler = eventListenerToHandlerMap[listener];
    if (!handler) {
        return;
    }
    handler(event);
})