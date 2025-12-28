const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
    SESSION_ID: process.env.SESSION_ID || "CRISS-AI~TtAnGBpD#ezWxm4p26xWvX1huS5yVME_GxKDvk5pwqEfdzEwqpgQ",
    AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN || "true",
    AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false",
    AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "false",
    AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*SEEN YOUR STATUS BY CRISS-AI 🤍*",
    WELCOME: process.env.WELCOME || "false",
    ADMIN_EVENTS: process.env.ADMIN_EVENTS || "false",
    ANTI_LINK: process.env.ANTI_LINK || "true",
    MENTION_REPLY: process.env.MENTION_REPLY || "false",
    MENU_IMAGE_URL: process.env.MENU_IMAGE_URL || "https://res.cloudinary.com/dgy2dutjs/image/upload/v1751624587/url.crissvevo.co.tz/IMG_2353_fze42l.jpg",
    PREFIX: process.env.PREFIX || ".",
    BOT_NAME: process.env.BOT_NAME || "CRISS-AI",
    STICKER_NAME: process.env.STICKER_NAME || "CRISS-AI",
    CUSTOM_REACT: process.env.CUSTOM_REACT || "false",
    CUSTOM_REACT_EMOJIS: process.env.CUSTOM_REACT_EMOJIS || "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
    DELETE_LINKS: process.env.DELETE_LINKS || "false",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "94724659430",
    OWNER_NAME: process.env.OWNER_NAME || "ᴄʀɪss ᴠᴇᴠᴏ",
    DESCRIPTION: process.env.DESCRIPTION || "*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄʀɪss ᴠᴇᴠᴏ*",
    ALIVE_IMG: process.env.ALIVE_IMG || "https://res.cloudinary.com/dgy2dutjs/image/upload/v1751624587/url.crissvevo.co.tz/IMG_2353_fze42l.jpg",
    LIVE_MSG: process.env.LIVE_MSG || "> Zinda Hun Yar *CRISS-AI*⚡",
    READ_MESSAGE: process.env.READ_MESSAGE || "false",
    AUTO_REACT: process.env.AUTO_REACT || "false",
    ANTI_BAD: process.env.ANTI_BAD || "false",
    MODE: process.env.MODE || "private", // පොදු භාවිතයට 'public' කරන්න
    ANTI_LINK_KICK: process.env.ANTI_LINK_KICK || "false",
    AUTO_VOICE: process.env.AUTO_VOICE || "false",
    AUTO_STICKER: process.env.AUTO_STICKER || "false",
    AUTO_REPLY: process.env.AUTO_REPLY || "false",
    ALWAYS_ONLINE: process.env.ALWAYS_ONLINE || "false",
    PUBLIC_MODE: process.env.PUBLIC_MODE || "false",
    AUTO_TYPING: process.env.AUTO_TYPING || "false",
    READ_CMD: process.env.READ_CMD || "false",
    DEV: process.env.DEV || "94724659430",
    ANTI_VV: process.env.ANTI_VV || "true",
    ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "inbox",
    AUTO_RECORDING: process.env.AUTO_RECORDING || "false"
};
