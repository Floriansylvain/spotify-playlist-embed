`use client`

import React, {ChangeEvent, useEffect, useRef, useState} from 'react'
import Image from "next/image";

import './audioPlayer.css'
import {getTimeLength} from "@/app/utils/timeManipulator";

export default function AudioPlayer(props: { track?: SpotifyApi.TrackObjectFull, onNext: () => void, onPrev: () => void }): React.JSX.Element {
    const audio = useRef<HTMLAudioElement | null>(null)
    const rangeInput = useRef<HTMLInputElement | null>(null)

    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)

    function togglePlay(): void {
        if (isPlaying) audio.current?.pause()
        else audio.current?.play()
        setIsPlaying(!isPlaying)
    }

    function reloadAudio(): void {
        audio.current?.load()
        if (!isPlaying) setIsPlaying(true)
    }

    function onEnded(): void {
        if (!audio.current) return
        audio.current.currentTime = 0
        props.onNext()
        reloadAudio()
    }

    function updateProgressStyle(progressValue: number): void {
        if (!rangeInput.current) return
        rangeInput.current.style.background = `linear-gradient(90deg, rgb(75, 85, 99) ${progressValue}%, rgb(209, 213, 219) ${progressValue}%)`
    }

    function onRangeInputChange(event: ChangeEvent<HTMLInputElement>) {
        if (!props.track) return;
        setProgress(event.target.valueAsNumber);
        if (!audio.current) return;
        audio.current.currentTime = event.target.valueAsNumber / 1000;
    }

    audio.current?.addEventListener('ended', onEnded)
    audio.current?.addEventListener('loadstart', audio.current?.play)
    audio.current?.addEventListener('timeupdate', (e) => {
        if (!audio.current) return
        setProgress(audio.current?.currentTime * 1000)
        updateProgressStyle(((audio.current?.currentTime) / 30) * 100)
    })

    useEffect(() => {
        reloadAudio()
    }, [props.track]);

    return (
        <div>
            <audio ref={audio} className="hidden">
                <source src={props.track?.preview_url ?? undefined} type="audio/mpeg"/>
                Your browser does not support the audio element.
            </audio>

            <div className="flex">
                <div className="w-16">
                    <Image src={props.track?.album.images[0].url as string} width={64} height={64}
                           alt="album cover"/>
                </div>
                <div className="flex flex-col flex-grow justify-center px-2 gap-1">
                    <h2>{props.track?.name} {props.track?.preview_url == null ?
                        <b>(no preview available)</b> : undefined}</h2>
                    <div className="flex gap-1 items-center">
                        <button onClick={props.onPrev}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                <path
                                    d="M220-240v-480h80v480h-80Zm520 0L380-480l360-240v480Zm-80-240Zm0 90v-180l-136 90 136 90Z"/>
                            </svg>
                        </button>
                        <button onClick={togglePlay}>
                            {isPlaying ?
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960"
                                     width="24">
                                    <path
                                        d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z"/>
                                </svg> :
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960"
                                     width="24">
                                    <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/>
                                </svg>}
                        </button>
                        <button onClick={props.onNext}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                <path
                                    d="M660-240v-480h80v480h-80Zm-440 0v-480l360 240-360 240Zm80-240Zm0 90 136-90-136-90v180Z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <input id="default-range" type="range" min={0} max={30000} value={progress}
                       aria-valuenow={progress} onChange={onRangeInputChange}
                       className="appearance-none w-full h-2"
                       ref={rangeInput}/>
                <label htmlFor='default-range'>{getTimeLength(progress ?? 0)}</label>
            </div>
        </div>
    )
}