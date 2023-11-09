'use client'
import React, {useEffect, useRef, useState} from 'react'

import '../../global.css'
import {useParams} from "next/navigation"
import AudioPlayer from "@/components/audioPlayer";
import {getTimeLength} from "@/app/utils/timeManipulator";

const AudioPlayerSkeleton = () => {
    return (
        <>
            <div className="flex">
                <div className="w-16 bg-gray-300 h-16 animate-pulse"></div>
                <div className="flex flex-col flex-grow justify-center px-2 gap-1">
                    <h2 className="bg-gray-300 h-6 w-2/3 animate-pulse"></h2>
                    <div className="flex gap-1 items-center">
                        <button className="bg-gray-300 h-8 w-8 rounded-full animate-pulse"></button>
                        <button className="bg-gray-300 h-8 w-8 rounded-full animate-pulse"></button>
                        <button className="bg-gray-300 h-8 w-8 rounded-full animate-pulse"></button>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="bg-gray-300 h-2 w-96 animate-pulse"></div>
                <label className="bg-gray-300 h-6 w-10 animate-pulse"></label>
            </div>
        </>
    )
}



export default function Page(): React.JSX.Element {
    const params = useParams()
    const playlistId = params.playlistId as string ?? ''

    const [tracks, setTracks] = useState<(SpotifyApi.TrackObjectFull | null)[] | undefined>()

    const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
    const [currentTrack, setCurrentTrack] = useState<SpotifyApi.TrackObjectFull | undefined>()

    useEffect(() => {
        fetch(`/api/playlist?id=${playlistId}`)
            .then(response => response.json())
            .then((data: SpotifyApi.SinglePlaylistResponse) => {
                const localTracks = data?.tracks?.items?.map(playlistTrack => playlistTrack.track)
                setTracks(localTracks)
                setCurrentTrack(localTracks?.at(0) ?? undefined)
            })
    }, [playlistId]);

    function changeTrack(direction: 'next' | 'prev') {
        const directions = {'next': 1, 'prev': -1}
        let localIndex = currentTrackIndex + directions[direction]

        if (localIndex > (tracks?.length ?? 1) - 1 || localIndex < 0) {
            localIndex = 0
        }

        setCurrentTrackIndex(localIndex)
        setCurrentTrack(tracks?.at(localIndex) ?? undefined)
    }

    return (
        <main className="flex flex-col w-screen h-screen justify-center items-center content-center bg-gray-800 text-white fill-white">
            <div className="w-full max-w-sm">
                {currentTrack ?
                    <AudioPlayer track={currentTrack}
                                 onNext={() => changeTrack('next')}
                                 onPrev={() => changeTrack('prev')}></AudioPlayer> :
                    <AudioPlayerSkeleton></AudioPlayerSkeleton>}
                <div>
                    {tracks?.map((track: any, index: number) => (
                        <div key={track.uri}>
                            <button onClick={() => {
                                setCurrentTrackIndex(index)
                                setCurrentTrack(tracks?.at(index) ?? undefined)
                            }}>{index + 1} {track.name} {getTimeLength(track.duration_ms)}</button>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}