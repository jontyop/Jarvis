System({
    pattern: "sayoni",
    fromMe: true,
    type: "group",
    adminAccess: true,
    desc: "mention all users in the group"
}, async (message, match) => {
    if (!message.isGroup) return await message.reply(`@${message.sender.split("@")[0]}`, { mentions: [message.sender] });   
    const { participants } = await message.client.groupMetadata(message.from).catch(e => {});
    let admins = await participants.filter(v => v.admin !== null).map(v => v.id);
    let msg = "";
    if (match === "all" || match === "everyone") {
        for (let i = 0; i < participants.length; i++) {
            msg += `${i + 1}. @${participants[i].id.split('@')[0]}\n`;
        }
        await message.send(msg, { mentions: participants.map(a => a.id) });
    } 
    else if (match === "admin" || match === "admins") {
        for (let i = 0; i < admins.length; i++) {
            msg += `${i + 1}. @${admins[i].split('@')[0]}\n`;
        }
        return await message.send(msg, { mentions: participants.map(a => a.id) });
    } 
    else if (match === "me" || match === "mee") {
        await message.send(`@${message.sender.split("@")[0]}`, { mentions: [message.sender] });
    } 
    else if (match || message.reply_message.text) {
        match = match || message.reply_message.text;
        if (!match) return await message.reply('*Example :* \n_*tag all*_\n_*tag admin*_\n_*tag text*_\n_*Reply to a message*_');
        await message.send(match, { mentions: participants.map(a => a.id) });
    } 
    else if (message.reply_message.i) {
        return await message.client.forwardMessage(message.jid, message.reply_message.message, { contextInfo: { mentionedJid: participants.map(a => a.id) } });
    } 
    else {
        return await message.reply("*Example :* \n_*tag all*_\n_*tag admin*_\n_*tag me*_\n_*tag text*_\n_*Reply to a message to tag that message*_");
    }
});
