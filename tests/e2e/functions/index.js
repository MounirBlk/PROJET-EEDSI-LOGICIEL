//const nodemailer = require('nodemailer');
//const axios = require('axios');
const fs = require('fs');

exports.randomFileName = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    let hhMinSecMili = today.getHours() + today.getMinutes() + '' + today.getSeconds() + '' + today.getMilliseconds()
    today = dd + '-' + mm + '-' + yyyy + '_' + hhMinSecMili;
    return today;
}

/**
 *  Random number between min and max
 *  @param {number} min  
 *  @param {number} max  
 */
exports.randNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 *  Random char (default taille 10)
 *  @param {number} length ? 
 */
exports.randomChars = (length) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result.trim().charAt(0).toUpperCase() + result.trim().substring(1).toLowerCase(); // 1 lettre maj mini
}

exports.randomName = (length) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

/*exports.sendEmail = (name, today) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: "robot.enjeux@gmail.com",
            pass: "robotenjeux123",
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    transporter.sendMail({
        from: '"Lucien Robot"<robot.enjeux@gmail.com>', //"Lucien Robot" 
        to: 'mou95500@gmail.com',
        subject: "Test Nightwatch Application " + name,
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title></title>
            <style type="text/css">
                * {
                    margin: 0;
                    padding: 0;
                    font-family: "Ubuntu", sans-serif;
                    box-sizing: border-box;
                    text-decoration: none;
                }
                
                body {
                    height: 100vh;
                    background-size: cover;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .profile-card {
                    width: 900px;
                    text-align: center;
                    border-radius: 8px;
                    overflow: hidden;
                    padding-top: 50px;
                    margin-top: 50px;
                }
                
                .card-header {
                    background: #2c3a47;
                    padding: 30px 20px;
                }
                
                .pic {
                    display: inline-block;
                    padding: 8px;
                    background: linear-gradient(130deg, #74b9ff, #e66767);
                    margin: auto;
                    border-radius: 50%;
                    background-size: 200% 200%;
                    animation: animated-gradient 2s linear infinite;
                }
                
                @keyframes animated-gradient {
                    25% {
                        background-position: left bottom;
                    }
                    50% {
                        background-position: right bottom;
                    }
                    75% {
                        background-position: right top;
                    }
                    100% {
                        background-position: left top;
                    }
                }
                
                .pic img {
                    display: block;
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                }
                
                .name {
                    color: #f2f2f2;
                    font-size: 28px;
                    font-weight: 600;
                    margin: 10px 0;
                }
                
                .desc {
                    font-size: 18px;
                    color: #e66767;
                }
                
                .contact-btn {
                    display: inline-block;
                    padding: 12px 30px;
                    color: #e66767;
                    border: 2px solid #e66767;
                    border-radius: 6px;
                    margin-top: 5px;
                    transition: .3s linear;
                }
                
                .contact-btn:hover {
                    background: #e66767;
                    color: #f2f2f2;
                }
                
                .card-footer {
                    background: #2c3a47;
                    padding-top: 10px;
                }
            </style>
        </head>
        <body>
            <center>
                <div class="profile-card">
                    <div class="card-header">
                        <div class="pic">
                            <img src="cid:icon" alt="icon">
                        </div>
                        <div class="name">Mounir Lucien</div>
                        <div class="desc">Développeur full stack</div>
                        <span class="contact-btn">mounir.ballouk@gmail.com</span>
                    </div>
                    <div class="card-footer">
                        <h2 style="border: solid 2px white"><strong style="color: #f2f2f2;">${name}</strong></h2>
                        <p />
                        <img style="width:900px" src="cid:testImg" alt="img">
                    </div>
                </div>
            </center>
        </body>
        
        </html>`,
        attachments: [{
                filename: 'screen_' + today + '.png',
                path: './tests/screens/screen_' + today + '.png',
                cid: 'testImg'
            },
            {
                filename: `icon_m.ico`,
                path: './public/icon_m.ico',
                cid: 'icon'
            }
        ]
    }, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            //console.log('Email sent: ' + info.response)
            console.log('Email for mou95500@gmail.com :  ' + name + ' ' + today);
            setTimeout(() => {
                fs.unlink(`tests/screens/screen_${today}.png`, (err) => {
                    if (err) throw err;
                });
            }, 1000);
        }
    });
}

exports.request = async() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
        .then(async(response) => {
            console.log('Ok');
            //console.log(response.data);
        })
        .catch((error) => {
            console.log(error);
        })
}*/