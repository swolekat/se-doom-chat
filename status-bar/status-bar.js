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
    debugger;
})

const onMessage = (event) => {
    const data = obj.detail.event.data;
    const {text} = data;

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

const onFollower = (event) => {
    const name = event?.name;
    data.latestFollower = name;
    if(!data.followMessages){
        return;
    }
    const msgId = `follower-${name}`;
    const html = createFollowerMessageHtml({displayName: name, msgId });
    showMessage(msgId, html);
};

const onSubscriber = (event) => {
    const name = event?.name;
    data.latestSubscriber = name;
    if(!data.subMessages){
        return;
    }
    const msgId = `subscriber-${name}`;
    const html = createSubMessageHtml({displayName: name, msgId });
    showMessage(msgId, html);
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