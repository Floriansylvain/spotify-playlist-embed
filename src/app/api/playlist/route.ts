import SpotifyWebApi from "spotify-web-api-node";
import {NextResponse} from "next/server";

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
})

async function setAccessToken(): Promise<void> {
    await spotifyApi.clientCredentialsGrant().then(
        (data) => spotifyApi.setAccessToken(data.body['access_token']),
        (err) => console.error('Something went wrong when retrieving an access token', err)
    )
}

export async function GET(request: Request) {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    let playlist: SpotifyApi.SinglePlaylistResponse | undefined = undefined

    if (spotifyApi.getAccessToken() === undefined) {
        await setAccessToken()
    }

    await spotifyApi.getPlaylist(id as string).then(
        (data) => playlist = data.body,
        (err) => console.error(err)
    )

    return new NextResponse(JSON.stringify(playlist), {
        headers: {
            'content-type': 'application/json',
        },
    })
}