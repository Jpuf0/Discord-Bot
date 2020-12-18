const { Canvas, resolveImage } = require('canvas-constructor');
const { registerFont } = require('canvas')
const { resolve, join } = require('path');
const fetch = require('isomorphic-fetch');
const Eris = require('eris');
const moment = require('moment');
require('moment-duration-format');
registerFont(resolve(join(__dirname, '../../fonts/SamsungSans-Light.ttf')), { family: 'Discord'})

module.exports = async function (msg) {
    async function profile(member, self) {
        try {
            const result = await fetch(`https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png?size=1024`);
            if(!result.ok) throw new Error("Failed to get the avatar.");
            const avatar = await result.buffer();
            const _JoinDate = msg.channel.guild.members.get(msg.author.id).joinedAt

            // const _level = self.client.points.get(`${message.guild.id}-${message.author.id}`, "level")
            // const _points = self.client.points.get(`${message.guild.id}-${message.author.id}`, "points")

            const name = member.length > 20 ? member.substring(0, 9) + "..." : member;

            const background = await resolveImage(resolve(join(__dirname, '../../images/Yuis_Profile.jpg')))
            return new Canvas(800, 360)
                .printImage(background, 0, 0, 800, 360)
                .setTextAlign("center")//center text
                .setTextFont("30pt Discord")//set font size
                .setColor("#FFFFFF")//set font color to white
                .printText(name, 160, 326)//add the users name
                .toBufferAsync()


            /* return new Canvas(800, 360)
                    .setColor("#7289DA")//set rect color to #7289DA blurple
                    .addRect(168, 0, 632, 360) //right
                    .setColor("#2C2F33")//set rect color to #2C2F33 black that isnt black
                    .addRect(0, 0, 168, 360) //left
                    .addRect(338, 52, 462, 92) //top right
                    .addRect(448, 216, 352, 92) //bottom right
                    .setShadowColor("rgba(22, 22, 22, 1)") // This is a nice colour for a shadow.
                    .setShadowOffsetY(5) // Drop the shadow by 5 pixels.
                    .setShadowBlur(20) // Blur the shadow by 10.
                    //.addCircle(84, 90, 62)
                    //.addCircularImage(avatar, 20, 26, 64)
                    .addCircularImage(avatar, 170, 148, 128)//add circular image of avatar
                    .save()
                    //.createBeveledClip(20, 138, 138, 32, 5)
                    .createBeveledClip(40, 284, 276, 64, 10)//create name space
                    .setColor("#23272A")//set color to #23272A gray that isnt quite gray
                    .fill()
                    .restore()
                    .setTextAlign("center")//center text
                    .setTextFont("30pt Discord")//set font size
                    .setColor("#FFFFFF")//set font color to white
                    .addText(name, 160, 326)//add the users name
                    // .addText(`Level: ${_level}`, 715, 255)
                    // .addText(`Points: ${_points}`, 684, 300)
                    //.setTextFont("39px Discord")
                    .addText("Server Join\n    Date", 460, 87)
                    //.setTextFont("26pt Discord")//set font size
                    .addText(`${moment.utc(new Date(_JoinDate).toISOString).format('hh:mm')}`, 725, 90)
                    .addText(`${moment.utc(new Date(_JoinDate).toISOString).format('DD/MM/YYYY')}`, 681, 132)
                    .setAntialiasing('MSAA')
                    .toBuffer() 
            */
        } catch (error) {
            await msg.channel.createMessage(`Something Happened: ${error.message}`)
        }
    }

    
    const buffer = await profile(msg.author.username, this);
    const filename = `profile-${msg.author.username}.jpg`
    msg.channel.createMessage('', {
        file: buffer,
        name: filename
    })
}
