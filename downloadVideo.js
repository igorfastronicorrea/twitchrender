'use strict'

const Fs = require('fs')
const Path = require('path')
const Axios = require('axios')

async function downloadVideo(clips) {

    async function downloadVideos() {

        console.log("Starting download videos");
        var url = clips[i].clip.replace("-preview-480x272.jpg", ".mp4");
        var path = Path.resolve(__dirname, 'videos/download', `video${i}.mp4`)
        var writer = Fs.createWriteStream(path)
        var response = await Axios({
            url,
            method: 'GET',
            responseType: 'stream'
        })

        response.data.pipe(writer)

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve)
            writer.on('error', reject)
        })

    }

    for (var i = 0; i < clips.length; i++) {
        await downloadVideos(i);
    }

    return true;

}

module.exports = downloadVideo; 