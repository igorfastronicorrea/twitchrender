const axios = require('axios');

async function selectClips(channel) {

    var clips = [];

    for (var i = 0; i < channel.length; i++) {
        console.log(channel[i])
        var response = await axios.get(`https://api.twitch.tv/kraken/clips/top?channel=${channel[i]}&period=month&trending=true&limit=2`, {
            headers: {
                Authorization: "OAuth 1i8150gvnmsit8zus91vxnurtdd1ek",
                "client-id": "phs9qrg5l4mjewbt2r1k14dck8lcqv",
                Accept: "application/vnd.twitchtv.v5+json"
            }
        })
            .then(function (response) {
                console.log("Success");
                return response;
            })
            .catch(function (error) {
                console.log(error)
            })



        for (var y = 0; y < 2; y++) {
            var clip = { clip: response.data.clips[y].thumbnails.medium, duration: response.data.clips[y].duration }
            clips.push(clip);
        }

    }

    return clips;
}


module.exports = selectClips;