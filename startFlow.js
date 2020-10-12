const robots = {
    selectClips: require('./selectClips.js'),
    downloadVideo: require('./downloadVideo.js'),
    renderVideo: require('./renderVideo.js'),
    youtube: require('./youtube.js')
}

exports.start = async (req, res, next) => {
    //var clips = await robots.selectClips(["deercheerup", "gaules", "bt0tv", "boltz"]);
    var clips = await robots.selectClips(["deercheerup", "gaules", "bt0tv", "boltz"]);
    console.log(clips)
    var videos = await robots.downloadVideo(clips);
    console.log("the end")

    //pegar valores da duração dos clipes * 25 (quantidade de frames)
    var durationClips = await clips.reduce(getDurationClips, 0);
    function getDurationClips(total, item) {
        return total + item.duration;
    }
    durationClips = durationClips * 25;
    //duração de transicao = 75 frames para 3 transicoes desse template
    durationClips = durationClips + 75;
    //await robots.renderVideo();
    //durationClips
    //await robots.youtube();

    res.status(200).send({ success: "Ok" })
}

//start();
//module.exports = start;