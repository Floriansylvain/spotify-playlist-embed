'use client'
import React, {useEffect, useRef, useState} from 'react'

import '../../global.css'
import {useParams} from "next/navigation"
import AudioPlayer from "@/components/audioPlayer";
import {getTimeLength} from "@/app/utils/timeManipulator";

const AudioPlayerSkeleton = () => {
    return (
        <div className="flex gap-2">
            <div className="h-32 w-32 min-w-max animate-pulse bg-gray-300"></div>
            <div className="flex flex-grow flex-col">
                <div className="flex flex-grow flex-col justify-center gap-1 px-2">
                    <h2 className="h-6 w-2/3 animate-pulse bg-gray-300"></h2>
                    <div className="flex items-center gap-1">
                        <button className="h-8 w-8 animate-pulse rounded-full bg-gray-300"></button>
                        <button className="h-8 w-8 animate-pulse rounded-full bg-gray-300"></button>
                        <button className="h-8 w-8 animate-pulse rounded-full bg-gray-300"></button>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-2 w-96 animate-pulse bg-gray-300"></div>
                    <label className="h-6 w-10 animate-pulse bg-gray-300"></label>
                </div>
            </div>
        </div>
    )
}

const PlaylistSkeleton = () => {
    return (
        <div className="flex h-52 flex-col gap-1 overflow-scroll">
            {[...Array(10)].map((_, index) => (
                <div key={'skeleton playlist' + index + 1} className="rounded-lg bg-neutral-500">
                    <button className="flex w-full items-center gap-6 p-3">
                        <div className="text-neutral-400">{index + 1}</div>
                        <div className="h-6 w-2/3 animate-pulse bg-gray-300 text-left"></div>
                        <div className="ml-auto h-6 w-10 animate-pulse bg-gray-300 text-neutral-400"></div>
                    </button>
                </div>))}
        </div>
    )
}

export default function Page(): React.JSX.Element {
    const params = useParams()
    const playlistId = params.playlistId as string ?? ''

    const [tracks, setTracks] = useState<(SpotifyApi.TrackObjectFull | null)[] | undefined>()

    const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
    const [currentTrack, setCurrentTrack] = useState<SpotifyApi.TrackObjectFull | undefined>()

    const playlistDom = useRef<HTMLDivElement | null>(null)

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

        playlistDom.current?.scrollTo({
            top: localIndex * 52,
            behavior: 'smooth'
        })
    }

    return (
        <main
            className="flex h-screen w-screen flex-col content-center items-center justify-center bg-neutral-800 fill-white text-white">
            <div className="flex w-full max-w-xl flex-col overflow-clip rounded-xl bg-neutral-500 shadow-xl">
                <div className="p-6">
                    {currentTrack ?
                        <AudioPlayer track={currentTrack}
                                     onNext={() => changeTrack('next')}
                                     onPrev={() => changeTrack('prev')}></AudioPlayer> :
                        <AudioPlayerSkeleton></AudioPlayerSkeleton>}
                </div>
                <div className="bg-neutral-600 p-3">
                    {tracks ? (<div className="flex h-52 flex-col gap-1 overflow-scroll" ref={playlistDom}>
                        {tracks?.map((track: any, index: number) => (
                            <div key={track.uri}
                                 className={"rounded-lg hover:bg-neutral-500 " + (currentTrack?.uri === track.uri && 'bg-neutral-700')}>
                                <button className="flex w-full items-center gap-6 p-3" onClick={() => {
                                    setCurrentTrackIndex(index)
                                    setCurrentTrack(tracks?.at(index) ?? undefined)
                                }}>
                                    <div className="text-neutral-400">{index + 1}</div>
                                    <div className="text-left">{track.name}</div>
                                    <div className="ml-auto text-neutral-400">{getTimeLength(track.duration_ms)}</div>
                                </button>
                            </div>
                        ))}
                    </div>) : <PlaylistSkeleton></PlaylistSkeleton>}
                </div>
            </div>
        </main>
    )
}