import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../contexts/playerContext';

import Image from 'next/image';
import styles from './styles.module.scss';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';


export function Player(){
    const audioRef = useRef<HTMLAudioElement>(null)
    const[progress, setProgress] = useState(0);

    function setupProgressListener(){
        audioRef.current.currentTime = 0;
        audioRef.current.addEventListener('timeupdate', ()=>{
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }

    function handleSeek(amount: number){
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }
    function isEpisodeEnded(){
        if(hasNext){
            playNext()
        }else{
            clearPlayerState()
        }
    }

    const {currentEpisodeIndex, 
        episodeList, 
        isPlaying, 
        hasNext,
        hasPrevious,
        isLooping,
        isShuffling,
        togglePlay,
        toggleLoop, 
        togglePlayButton,
        toggleShuffe,
        playNext,
        playPrevious,
        clearPlayerState
    } = usePlayer();

    const episode = episodeList[currentEpisodeIndex];

    useEffect(()=>{
        if(audioRef.current == null){
            return;
        } else{

            if (isPlaying){
                audioRef.current.play();
            }else{
                audioRef.current.pause();
            }
        }

        
    },[isPlaying])

    return(
        <div className={styles.playerContainer}>
             <header>
                 <img src="/playing.svg" alt="tocanco agora"/>
                 <strong>Tocando agora</strong>
             </header>
             {episode?(
                 <div className={styles.currentPlayer}>
                    <Image width={592} height={592} src={episode.thumbnail} objectFit='cover'/>
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                 </div>
                 

             ):(
             
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast</strong>
                </div>
                
                )}

             <footer className={!episode ? styles.empty: ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {
                            episode ? (
                            <Slider 
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{backgroundColor:'#04d361'}} 
                                railStyle={{backgroundColor:'#9f75ff'}}
                                handleStyle={{borderColor:'#04d361', borderWidth:4}}
                            />
                            ):(<div className={styles.emptySlider}/>)
                        }
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                {episode &&
                
                (<audio src={episode.url} 
                    ref={audioRef} 
                    onPlay={()=>togglePlayButton(true)} 
                    onPause={()=>togglePlayButton(false)} 
                    autoPlay
                    loop={isLooping}
                    onLoadedData ={()=> setupProgressListener()}
                    onEnded={isEpisodeEnded}
                />)}
                
                

                <div className={styles.buttons}>
                    <button type='button' disabled={!episode || episodeList.length == 1} onClick={()=>toggleShuffe()} className={isShuffling? styles.isActive : ''}> <img src="/shuffle.svg" alt="Embaralhar"/></button>
                    <button type='button' disabled={!episode || !hasPrevious} onClick={()=>playPrevious()}>  <img src="/play-previous.svg" alt="Tocar anterior"/></button>
                    <button type='button' disabled={!episode} onClick={()=>togglePlay()} className={styles.playButton} > {isPlaying? (<img src="/pause.svg" alt="Tocar"/>):(<img src="/play.svg" alt="Tocar"/>)} </button>
                    <button type='button' disabled={!episode || !hasNext} onClick={()=>playNext()}> <img src="/play-next.svg" alt="Tocar proxima"/></button>
                    <button type='button' disabled={!episode} onClick={()=>toggleLoop()} className={isLooping? styles.isActive : ''}> <img src="/repeat.svg" alt="Repetir"/></button>
                    
                </div>
             </footer>
        </div>
    )
}