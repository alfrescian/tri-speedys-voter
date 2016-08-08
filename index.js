var tough = require('tough-cookie'), cookiejar = new tough.CookieJar(),
    fetch = require('fetch-cookie')(require('node-fetch'), cookiejar),
    MD5 = require('./md5'), shortid = require('shortid'), ip = require('ip');

console.log(ip.address());

var jsprid = '131', jspos = '27', jsart = '0', jschk;

fetch('https://www.perspektive150.de/foerderwettbewerb/startseite.php')
    .then(function () {
        var sessionId = cookiejar.getCookieStringSync('https://www.perspektive150.de').split('=')[1],
            today = new Date(), scode = today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate();
        jschk = MD5(sessionId + '-' + jsprid);

        fetch('https://www.perspektive150.de/foerderwettbewerb/phpscripts/captcha_check.php?scode='+ scode, {
            credentials: 'include',
        })
            .then(function (res) {
                return res.text();
            })
            .then(function (body) {
                console.log(body);

                var params = "prid=" + jsprid + "&pos=" + jspos + "&art=" + jsart + "&chk=" + jschk + "&chk2=" + MD5(shortid.generate());
                console.log(params);
                fetch('https://www.perspektive150.de/foerderwettbewerb/phpscripts/db_insert_vote.php', {
                    method: 'POST',
                    body: params,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    credentials: 'include'
                })
                    .then(function (res) {
                        return res.text();
                    }).then(function (body) {
                    console.log(body);
                });
            });
    });
