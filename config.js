module.exports = {
        TOKEN: 'NjQ4NTk2MTYxNTEwNTA2NTA2.XdwkBw.WhB1E0MfwHZcjzxcNhNeUcY42bg', //your discord bot token
        PREFIX: '?',
        playing: '',
		GOOGLE_API_KEY : "AIzaSyBE7tWsfg6xCFx6N2A4GdMpCxEY9MamOEs",
		clientId : "648596161510506506",

    opt: {
        DJ: {
            enabled: false, //IF YOU WANT ONLY DJS TO USE IT, set false to true.
            roleName: 'DJ', //WRITE WHAT THE NAME OF THE DJ ROLE WILL BE, THEY CAN USE IT ON YOUR SERVER
            commands: ['back', 'clear', 'filter', 'loop', 'pause', 'resume', 'skip', 'stop', 'volume'] //Please don't touch
        },
        maxVol: 250, //You can specify the maximum volume level.
        loopMessage: false, //Please don't touch
        discordPlayer: {
            ytdlOptions: {
                quality: 'highestaudio', //Please don't touch
                highWaterMark: 1 << 25 //Please don't touch
            }
        }
    }
};