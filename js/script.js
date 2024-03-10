console.log("lets write js")
let currentSong = new Audio();
let songs;
let currfolder;
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
      return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder){
  currfolder=folder;
 let a= await fetch(`http://127.0.0.1:3000/${folder}/`);
 let response=await a.text();
 let div=document.createElement("div")
 div.innerHTML =response;
 let as =div.getElementsByTagName("a")
 songs=[];
 for (let index = 0; index < as.length; index++) {
  const element = as[index];
  if(element.href.endsWith(".mp3")){
    
    songs.push(element.href.split(`/${folder}/`)[1])
  }
  
 }

 let songUL= document.querySelector(".songList").getElementsByTagName("ul")[0]
 songUL.innerHTML=""
for (const song of songs) {
  songUL.innerHTML=songUL.innerHTML+`<li> 
                <img class="invert" src="img/music.svg"  alt="">
                <div class="info">
                  <div> ${song.replaceAll("%20"," " )}</div>
                  <div>Spotify </div>
                </div>
                <div class="playnow">
                  <span>Play Now</span>
                  <img class="invert" src="img/play.svg" alt="">
                </div></li>`;

}
Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
  e.addEventListener("click",element=>{
    
    playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

  })
});
return songs;
 
}


const playMusic=(track,pause=false)=>{
  //let audio=new Audio("/songs/"+track)
  currentSong.src=`/${currfolder}/`+track
  currentSong.play()
  if(!pause){
    currentSong.play()
    play.src="img/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML=decodeURIComponent(track)
  document.querySelector(".songtime").innerHTML="00:00 / 00:00"

  
}
async function displayAlbums(){
 let a= await fetch(`http://127.0.0.1:3000/songs/`);
 let response=await a.text();
 let div=document.createElement("div")
 div.innerHTML =response;
 let anchors=div.getElementsByTagName("a")
 let cardContainer=document.querySelector(".cardContainer")
 let array=Array.from(anchors)
  for(let index=0;index < array.length;index++){
    const e=array[index]
  
  if(e.href.includes("/songs")){
   let folder= e.href.split("/").slice(-2)[0]
   //get the metadata of folder
   let a= await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
   let response=await a.json();
   
   cardContainer.innerHTML=cardContainer.innerHTML +`  <div data-folder="${folder}" class="card">
   <div  class="play">
     <svg
       xmlns="http://www.w3.org/2000/svg"
       width="20"
       height="20"
       viewBox="0 0 24 24"
       fill="none"
       xmlns:xlink="http://www.w3.org/1999/xlink"
       role="img"
     >
       <path
         d="M5 20V4L19 12L5 20Z"
         stroke="#000000"
         fill="#000"
         stroke-width="1.5"
         stroke-linejoin="round"
       ></path>
     </svg>
   </div>
   <img
     src="/songs/${folder}/cover.jpeg"
     alt=""
   />
   <h2>${response.title}</h2>
   <p>${response.description}</p>
 </div>`
  }
 }
 // load the playlist whenever the card is clicked
Array.from(document.getElementsByClassName("card")).forEach(e=>{
  e.addEventListener("click",async item=>{
    songs=await getSongs(`songs/${item.currentTarget.dataset.folder}`)
    playMusic(songs[0])
  })
})

}

async function main(){
  
await getSongs("songs/ncs");
 // playMusic(songs[0],true)

  //display all the albums on the page
  displayAlbums()


//eventlistener for prev , play , next
play.addEventListener("click",()=>{
  if(currentSong.paused){
    currentSong.play()
    play.src="img/pause.svg"
  }
  else{
    currentSong.pause()
    play.src="img/play.svg"
  }
})
//listen for time update event 
currentSong.addEventListener("timeupdate",()=>{
  
 
  document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
  document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100 +"%";
})
// add an event listener to seek bar
document.querySelector(".seekbar").addEventListener("click",e=>{
  let percent =(e.offsetX/e.target.getBoundingClientRect().width) *100
  document.querySelector(".circle").style.left=percent + "%";
  currentSong.currentTime =((currentSong.duration)*percent)/100
})
// hamburger
document.querySelector(".hamburger").addEventListener("click",()=>{
  document.querySelector(".left").style.left="0";
})
//close
document.querySelector(".close").addEventListener("click",()=>{
  document.querySelector(".left").style.left="-120%";
})
// add an even listener to prev and next
previous.addEventListener("click",()=>{
  currentSong.pause();
  
  let index=songs.indexOf( currentSong.src.split("/").slice(-1)[0 ])
 if(index-1 >= 0){
   playMusic(songs[index-1])
  }

})
next.addEventListener("click",()=>{
  currentSong.pause();
 
  let index=songs.indexOf( currentSong.src.split("/").slice(-1)[0])
 if((index+1) < songs.length){
   playMusic(songs[index+1])
  }

})
//Add an event to vol
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
  
  currentSong.volume=parseInt(e.target.value)/100
})
// Add an event listener to mute the track
document.querySelector(".volume>img").addEventListener("click",e=>{
 
  if(e.target.src.includes("img/volume.svg")){
    e.target.src= e.target.src.replace("volume.svg","mute.svg")
    currentSong.volume=0;
    document.querySelector(".range").getElementsByTagName("input")[0].value=0;
  }
  else{
    e.target.src= e.target.src.replace("mute.svg","volume.svg")
    currentSong.volume=0.10;
    document.querySelector(".range").getElementsByTagName("input")[0].value=10;

  }

})

} 
main()
