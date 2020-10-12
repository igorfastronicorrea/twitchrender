const express = require('express')
const google = require('googleapis').google
const youtube = google.youtube({ version: 'v3' })
const OAuth2 = google.auth.OAuth2
const fs = require('fs')
const { content } = require('googleapis/build/src/apis/content')
const path = require('path')

async function robot() {
    console.log('> [youtube-robot] Starting...')

    await authenticateWithOAuth()
    const videoInformation = await uploadVideo()
    await uploadThumbnail(videoInformation)

    async function authenticateWithOAuth() {
        const webServer = await startWebServer()
        const OAuthClient = await createOAuthClient()
        requestUserConsent(OAuthClient)
        const authorizationToken = await waitForGoogleCallback(webServer)
        await requestGoogleForAccessTokens(OAuthClient, authorizationToken)
        await setGlobalGoogleAuthentication(OAuthClient)
        await stopWebServer(webServer)

        async function startWebServer() {
            return new Promise((resolve, reject) => {
                const port = 5000
                const app = express()

                const server = app.listen(port, () => {
                    console.log(`> [youtube-robot] Listening on http://localhost:${port}`)

                    resolve({
                        app,
                        server
                    })
                })
            })
        }

        async function createOAuthClient() {
            const credentials = require('./credentials/google-youtube.json')

            const OAuthClient = new OAuth2(
                credentials.web.client_id,
                credentials.web.client_secret,
                credentials.web.redirect_uris[0]
            )

            return OAuthClient
        }

        function requestUserConsent(OAuthClient) {
            const consentUrl = OAuthClient.generateAuthUrl({
                access_type: 'offline',
                scope: ['https://www.googleapis.com/auth/youtube']
            })

            console.log(`> [youtube-robot] Please give your consent: ${consentUrl}`)
        }

        async function waitForGoogleCallback(webServer) {
            return new Promise((resolve, reject) => {
                console.log('> [youtube-robot] Waiting for user consent...')

                webServer.app.get('/oauth2callback', (req, res) => {
                    const authCode = req.query.code
                    console.log(`> [youtube-robot] Consent given: ${authCode}`)

                    res.send('<h1>Thank you!</h1><p>Now close this tab.</p>')
                    resolve(authCode)
                })
            })
        }

        async function requestGoogleForAccessTokens(OAuthClient, authorizationToken) {
            return new Promise((resolve, reject) => {
                OAuthClient.getToken(authorizationToken, (error, tokens) => {
                    if (error) {
                        return reject(error)
                    }

                    console.log('> [youtube-robot] Access tokens received!')

                    console.log(tokens)
                    OAuthClient.setCredentials(tokens)
                    resolve()
                })
            })
        }

        function setGlobalGoogleAuthentication(OAuthClient) {

            console.log(OAuthClient)

            google.options({
                auth: OAuthClient
            })
        }

        async function stopWebServer(webServer) {
            return new Promise((resolve, reject) => {
                webServer.server.close(() => {
                    resolve()
                })
            })
        }
    }

    async function uploadVideo() {

        /* var OAuthClient1 = {
            aa: {
                OAuthClient: {
                    _eventsCount: 0,
                    _maxListeners: undefined,
                    credentials: {
                        access_token:
                            "ya29.a0AfH6SMCZ9YnYssMzq7FGHM_FdEXWgBXDcmqH7tInTU4O7kdYtxC2HQURUSNQjyoP-vC4dMxRIn501H7qSOs1ow4OU5In7-OmGbss8Vt5B0AONsq35KwVsAmZnVeHoMr_fMtNGmW9PqwUI6kxJpIleCf1CVFDDFHIRD0",
                        refresh_token:
                            '1//0hNS202HEztZvCgYIARAAGBESNwF-L9IrnOjjG0vynOA4OpR-l5gOZhsPHkPk3UJWKqZoWHFsycDZ-KLht1YtAnn-SCE0_Bq4-_U',
                        scope: 'https://www.googleapis.com/auth/youtube',
                        token_type: 'Bearer',
                        expiry_date: 1602466923654
                    },
                    certificateCache: {},
                    certificateExpiry: null,
                    certificateCacheFormat: "PEM",
                    _clientId:
                        "508488708700-3cpp7jbkjubodg0nskb17dsvhsh4sgrj.apps.googleusercontent.com",
                    _clientSecret: "rHIQVu0NOciEzygAEfOZdp6S",
                    redirectUri: "http://localhost:5000/oauth2callback",
                    eagerRefreshThresholdMillis: 300000,
                    forceRefreshOnFailure: false

                }
            }
        }

        console.log("*************AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA*********")
        console.log(OAuthClient1.aa)

        google.options({
            auth: OAuthClient1.aa
        }) */


        /* const OAuthClient = new OAuth2(
            "508488708700-3cpp7jbkjubodg0nskb17dsvhsh4sgrj.apps.googleusercontent.com",
            "rHIQVu0NOciEzygAEfOZdp6S",
            "http://localhost:5000/oauth2callback"
        )

        var accessTo = {
            access_token:
                'ya29.a0AfH6SMC4hUJuQUu-FKWAnF1wewP5KIFeURp4QOQ-8oKYVnDnSTSgj0PYT2tch4shptNSe7mOArvI81t7aLnMnehkfGKoaspMxEYwZnQYDUvx4-Z8d_3ZQ9F63-Zwmf2d553PwJTFVR_QLaR0sEV5c3FMZKyqJ238Qc0',
            refresh_token:
                '1//0h7bjb-Rs_k3rCgYIARAAGBESNwF-L9Irvpwz0dvb5DmsXdHxMjqG0L-H1Z_se9pX0kf7cM2swsvmPN8AlkjmfPzqJR22DmhMhPo',
            scope: 'https://www.googleapis.com/auth/youtube',
            token_type: 'Bearer',
            expiry_date: 1602524531759
        }

        OAuthClient.setCredentials(accessTo)

        google.options({
            auth: OAuthClient
        }) */

        const contentFilePath = './content/idVideoTitle.json'
        const fileBuffer = fs.readFileSync(contentFilePath, 'utf-8');
        const contentJson = JSON.parse(fileBuffer);
        console.log("AADA*************")
        console.log(contentJson.idVideo)

        const videoFilePath = './content/output.mov'
        const videoFileSize = fs.statSync(videoFilePath).size
        const videoTitle = `Robo dos clipes da Twitch #${contentJson.idVideo}`
        const videoTags = "GTA"
        const videoDescription = "Os melhores clipes da Twitch, siga o canal e ative o xininho"


        var contentNewId = { idVideo: contentJson.idVideo + 1 }
        const contentString = JSON.stringify(contentNewId);
        fs.writeFileSync(contentFilePath, contentString)


        const requestParameters = {
            part: 'snippet, status',
            requestBody: {
                snippet: {
                    title: videoTitle,
                    description: videoDescription,
                    tags: videoTags
                },
                status: {
                    privacyStatus: 'unlisted'
                }
            },
            media: {
                body: fs.createReadStream(videoFilePath)
            }
        }


        console.log('> [youtube-robot] Starting to upload the video to YouTube')
        const youtubeResponse = await youtube.videos.insert(requestParameters, {
            onUploadProgress: onUploadProgress
        })

        console.log(`> [youtube-robot] Video available at: https://youtu.be/${youtubeResponse.data.id}`)
        return youtubeResponse.data

        function onUploadProgress(event) {
            const progress = Math.round((event.bytesRead / videoFileSize) * 100)
            console.log(`> [youtube-robot] ${progress}% completed`)
        }

    }

    async function uploadThumbnail(videoInformation) {
        const videoId = videoInformation.id
        const videoThumbnailFilePath = './content/youtube-thumbnail.png'

        const requestParameters = {
            videoId: videoId,
            media: {
                mimeType: 'image/png',
                body: fs.createReadStream(videoThumbnailFilePath)
            }
        }

        const youtubeResponse = await youtube.thumbnails.set(requestParameters)
        console.log(`> [youtube-robot] Thumbnail uploaded!`)
    }


}

module.exports = robot
