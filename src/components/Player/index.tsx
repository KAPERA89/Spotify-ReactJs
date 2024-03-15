import { useEffect, useState } from "react"
import { PauseCircle, PlayBack, PlayCircle, PlayForward, VolumeMediumOutline, VolumeMuteOutline } from "react-ionicons"
import cover from "../../assets/images/musicCover.jpg";
const Player = () => {

    const [volume, setVolume] = useState("70")
    const [play, setPlay] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const totalDuration = 206  
    
    //dans cette useEffect on verifie si play est true ou pas si c'est le cas on met un interval qui se declance chaque 
    //1 seconde pour incrementer la valeur du prevTime et si la valeur de prevTime est plus grand que totalDuration 
    //cela signifie que play est en terminer a ce cas termine interval 
    // dans else on clear interval pour met en pause le timer 
    useEffect(() => {
        let intervalId: any;
          
        if(play){
            intervalId = setInterval(() => {
                setCurrentTime((prevTime) => {
                    if(prevTime >= totalDuration){
                        clearInterval(intervalId);
                        setPlay(false);
                        return 0;
                    }
                    return prevTime+1;
                })
            },1000)
        }else{
            clearInterval(intervalId)
        }

        return () => clearInterval(intervalId)
    },[play, totalDuration, isDragging])


    //par exemple si on a currentTime = 60sec et totalDuration = 120sec donc 60/120 = 0.5  
    //on prend cette 0.5 et on l'a multiplie avec 100 pour avoir le resultat en % 
    //cela nous permet de definir comment la progressBar est remplie 
    const progressBarWidth = (currentTime / totalDuration) * 100 

    const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
	};

	const handleProgressBarClick = (e: any) => {
		const progressBar = e.currentTarget;
		const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
		const progressBarWidth = progressBar.offsetWidth;
		const clickedTime = (clickPosition / progressBarWidth) * totalDuration;
		setCurrentTime(clickedTime);
	};

	const handleDragStart = () => {
		setIsDragging(true);
	};

	const handleDragMove = (e: any) => {
		if (isDragging && !play) {
			const progressBar = e.currentTarget;
			const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
			const progressBarWidth = progressBar.offsetWidth;
			const clickedTime = (clickPosition / progressBarWidth) * totalDuration;
			setCurrentTime(clickedTime);
		}
	};

	const handleDragEnd = () => {
		setIsDragging(false);
	};

    return (
		<div className="bg-[#121212] w-full h-12 px-5 py-7 fixed bottom-0 pl-[350px] flex items-center justify-between z-20">
			<div className="flex items-center gap-4">
				<img
					src={cover}
					className="rounded-md w-[65px]"
					alt="music"
				/>
				<div className="flex flex-col gap-1">
					<span className="text-[15px] font-medium opacity-85">Night Wolf</span>
					<span className="text-[13px] text-[#b3b3b3]">The villians</span>
				</div>
			</div>
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-4 w-full">
					<PlayBack
						color={"#b2b2b2"}
						width="27px"
						height="27px"
						cssClasses={"cursor-pointer"}
					/>
					{!play ? (
						<PlayCircle
							color={"#fff"}
							width="45px"
							height="45px"
							cssClasses={"cursor-pointer"}
							onClick={() => setPlay(true)}
						/>
					) : (
						<PauseCircle
							color={"#fff"}
							width="45px"
							height="45px"
							cssClasses={"cursor-pointer"}
							onClick={() => setPlay(false)}
						/>
					)}
					<PlayForward
						color={"#b2b2b2"}
						width="27px"
						height="27px"
						cssClasses={"cursor-pointer"}
					/>
					<div className="flex items-center w-full gap-2">
						<span className="text-[#b3b3b3] text-[14px] font-medium md:block hidden">
							{formatTime(currentTime)}
						</span>
						<div
							className="md:w-[350px] w-[110px] bg-[#4d4d4d] rounded-md h-[6px] relative cursor-pointer"
							onClick={handleProgressBarClick}
							onMouseDown={handleDragStart}
							onMouseMove={handleDragMove}
							onMouseUp={handleDragEnd}
							onMouseLeave={handleDragEnd}
						>
							<div
								className="absolute left-0 top-0 h-full bg-[#1ed760] rounded-md"
								style={{ width: `${progressBarWidth}%` }}
							></div>
						</div>
						<span className="text-[#b3b3b3] text-[14px] font-medium md:block hidden">
							{formatTime(totalDuration)}
						</span>
					</div>
				</div>
			</div>

			<div className="hidden md:flex items-center gap-3">
				{volume === "0" ? (
					<VolumeMuteOutline
						color={"#b3b3b3"}
						width={"25px"}
						height={"25px"}
						onClick={() => setVolume("100")}
						cssClasses={"cursor-pointer"}
					/>
				) : (
					<VolumeMediumOutline
						color={"#b3b3b3"}
						width={"25px"}
						height={"25px"}
						onClick={() => setVolume("0")}
						cssClasses={"cursor-pointer"}
					/>
				)}
				<input
					type="range"
					min="0"
					max="100"
					value={volume}
					onChange={(e) => setVolume(e.target.value)}
					className="accent-[#1ed760]"
				/>
			</div>
		</div>
	);
}

export default Player