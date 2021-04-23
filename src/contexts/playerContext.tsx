import {createContext, useState, ReactNode, useContext} from "react";
import Episode from "../pages/episodes/[slug]";


type Episode = {
    title:string, 
    members:string;
    thumbnail:string;
    duration:number;
    url:string;
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    hasNext:boolean;
    hasPrevious:boolean;
    isShuffling:boolean;
    togglePlay:() =>void;
    toggleLoop:() =>void;
    toggleShuffe:() =>void;
    togglePlayButton:(status:boolean) =>void;
    play:(episode:Episode) => void;
    playList:(list:Episode[],index:number) =>void;
    playNext: () =>void;
    playPrevious:() =>void;
    clearPlayerState:() =>void;
    


}

type playerProviderProps = {
    children: ReactNode;

}

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerProviders({children}:playerProviderProps){
    const[episodeList, setEpisodeList] = useState<Episode[]>([]);
    const[currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const[isPlaying, setIsPlaying] = useState(false);
    const[isLooping, setIsLooping] = useState(false);
    const[isShuffling, setIsShuffling] = useState(false);

    function play (episode:Episode){
        setEpisodeList([episode])
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function playList(list: Episode[], index:number){
        setEpisodeList(list)
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function togglePlay(){
        setIsPlaying(!isPlaying);
    }
    function toggleLoop(){
        setIsLooping(!isLooping);
    }
    function toggleShuffe(){
        setIsShuffling(!isShuffling);
    }

    function togglePlayButton(status:boolean){
        setIsPlaying(status);
    }

    const hasNext = isShuffling || currentEpisodeIndex < (episodeList.length-1);
    const hasPrevious = currentEpisodeIndex > 0;

    function playNext(){
        if (isShuffling){
            const nextRandomEpisodeIndex = Math.floor(Math.random()*episodeList.length)
            setCurrentEpisodeIndex(nextRandomEpisodeIndex)

        }else if(hasNext){
            setCurrentEpisodeIndex(currentEpisodeIndex+1)
        }

    }
    function playPrevious(){
        if(hasPrevious){
            setCurrentEpisodeIndex(currentEpisodeIndex-1)
        }
    }

    function clearPlayerState(){
        setEpisodeList([])
        setCurrentEpisodeIndex(0)
    }



     return(
        <PlayerContext.Provider value={
            {
                episodeList,
                currentEpisodeIndex,
                isPlaying,
                hasNext,
                hasPrevious,
                isLooping,
                isShuffling,
                play,
                togglePlay,
                togglePlayButton,
                playList,
                playNext,
                playPrevious,
                toggleLoop,
                toggleShuffe,
                clearPlayerState

            }
        }>
            
            {children}
        </PlayerContext.Provider>
     )


}

export const usePlayer = () =>{
    return useContext(PlayerContext);
}