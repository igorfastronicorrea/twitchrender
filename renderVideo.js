
const spawn = require('child_process').spawn
const path = require('path')
const os = require('os');
const rootPath = path.resolve(__dirname, '..')

const fromRoot = relPath => path.resolve(rootPath, relPath)

//async function robot() {
exports.start = async (req, res, next) => {
    //durationClips
    console.log('> [video-robot] Starting...')

    await renderVideoWithAfterEffects()

    return true;

    async function renderVideoWithAfterEffects() {
        return new Promise((resolve, reject) => {
            const systemPlatform = os.platform
            const aerenderFilePath = 'C:\\Program Files\\Adobe\\Adobe After Effects 2020\\Support Files\\aerender.exe'

            console.log(aerenderFilePath)
            const templateFilePath = fromRoot('./authentication-node-sample/videos/template1.aep')
            const destinationFilePath = fromRoot('./authentication-node-sample/content/output.mp4')


            console.log('> [video-robot] Starting After Effects')
            //console.log(`Clip dduration: ${durationClips}`);

            const aerender = spawn(aerenderFilePath, [
                '-comp', 'main',
                '-project', templateFilePath,
                '-output', destinationFilePath

            ])

            /* '-e', durationClips */
            aerender.stdout.on('data', (data) => {
                process.stdout.write(data)
            })

            aerender.on('close', () => {
                console.log('> [video-robot] After Effects closed')
                resolve()
            })
        })
    }

}

//module.exports = robot
