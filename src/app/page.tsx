import React from 'react'

import './global.css'

export default function Page(): React.JSX.Element {
    return (
        <main>
            <h1 className="text-4xl">Spotify Playlist Embed</h1>
            <p>
                Welcome to the Spotify Playlist Embed. This mini-project shows how to embed a Spotify playlist using
                the Spotify Web API, using NextJS and UseSWR as constraints.
            </p>
            <p>Go to <a className="underline text-blue-500"
                        href="/playlist/4NvnfRMD94mQGFBV1SWu7E">/playlist/[playlistId]</a> to start using the tool.</p>
        </main>
    )
}