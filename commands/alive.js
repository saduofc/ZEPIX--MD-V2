const { runtime } = require("../lib/allFunction");
const os = require("os");

module.exports = [
    {
        name: "alive",
        description: "Alive Command",
        ownerOnly: false,
        async execute(sock,msg,args,context){
            const { from, pushname, replyimg, sadiya_md_footer } = context;
            try{
                let desc = `👋 Hello, ${pushname}

●🧑‍💻𝐇𝐄𝐘 𝐈 𝐀𝐌 𝐋𝐈𝐒𝐀 𝐌𝐃🧑‍💻●

*┃⏱️ Run Time :-* ${runtime(process.uptime())}
*┃🗃️ Memory :-* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
*┃📍 Platform :-* ${os.hostname()}
*┃👥 Owner :-* Sadiya Tech

*🌞Have A Nice Day🌞*

*🔢 Reply below number,*
1 | 📍 Bot Speed 
2 | 📂 Menu Panel

${sadiya_md_footer}`;

            replyimg(desc)
            }catch(e){
                console.log(e)
            }
        }
    }
]   
