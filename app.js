const container = document.querySelector(".container");
const image = document.querySelector("#music-image");
const title = document.querySelector("#music-details .title");
const singer = document.querySelector("#music-details .singer");
const prev = document.querySelector("#controls #prev");
const play = document.querySelector("#controls #play");
const next = document.querySelector("#controls #next");
const duration = document.querySelector("#duration");
const currentTime = document.querySelector("#current-time");
const progressBar = document.querySelector("#progress-bar");
const volume = document.querySelector("#volume");
const volumeBar = document.querySelector("#volume-bar");
const ul = document.querySelector("ul");

const player = new MusicPlayer(musicList);


window.addEventListener("load", () => { // sayfa yüklendiğinde
    let music = player.getMusic();
    displayMusic(music);
    displayMusicList(player.musicList);
    isPlayingNow();
})

// şarkıyı görüntüle
function displayMusic(music){
    title.innerText = music.getName();
    singer.innerText = music.singer;
    image.src ="img/" + music.img;
    audio.src ="mp3/" + music.file;
}

// play next ve prev ikonlarına tıklandığında
play.addEventListener("click", () => {
    const isMusicPlay = container.classList.contains("playing");
    isMusicPlay ? pauseMusic() : playMusic();
})

prev.addEventListener("click", () => {
    prevMusic();
})

next.addEventListener("click", () => {
    nextMusic();
})

// sonraki müziğe geç
const nextMusic = () =>{
    player.next();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
    isPlayingNow();
}
// önceki müziğe geç
const prevMusic = () => {
    player.prev();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
    isPlayingNow();
}
// müziği durdur
const pauseMusic = () =>{
    container.classList.remove("playing");
    play.querySelector("i").classList = "fa-solid fa-play";
    audio.pause();
}
// oynat
const playMusic = () =>{
    container.classList.add("playing");
    play.querySelector ("i").classList = "fa-solid fa-pause";
    audio.play();
}

// süreyi dakika ve saniye cinsine çevirme
const calculateTime = (toplamSaniye) =>{
    const dakika = Math.floor(toplamSaniye /60); // dakika kısmını aldık
    const saniye = Math.floor(toplamSaniye % 60);    // arta kalan saniye kısmı
    const guncellenenSaniye = saniye < 10 ? `0${saniye}` :`${saniye}`;
    const sonuc = `${dakika}: ${guncellenenSaniye}`;
    return sonuc;
}
// müzikle ilişkilendirme
audio.addEventListener("loadedmetadata", () =>{
    duration.textContent = calculateTime(audio.duration); // toplam müzik süresi
    progressBar.max = Math.floor(audio.duration);   // barın toplam uzunluğu müzik süresi kadar.
})
// süre yenilenmesi
audio.addEventListener("timeupdate", () =>{
    progressBar.value = Math.floor(audio.currentTime); // şarkının suanki uzunlugu progress barın uzunlugu olsun
    currentTime.textContent = calculateTime(progressBar.value); // su anki zaman hesaplama
})

// şarkıyı ileri-geri sarma
progressBar.addEventListener("input", () => {
    currentTime.textContent = calculateTime(progressBar.value); // inputta sarma işlemi yapıldığında süre güncellensin
    audio.currentTime = progressBar.value; // barın ilerlemesi şarkının şu anki zamanına
});

// ses açıkken tıklanırsa susturulsun, tam tersiyse çalsın
let sesDurumu = "sesli"
volume.addEventListener("click", () => {
    if(sesDurumu === "sesli"){
        audio.muted = true;
        sesDurumu = "sessiz";
        volume.classList = "fa-solid fa-volume-xmark";
        volumeBar.value = 0;
    }
    else{
        audio.muted = false;
        sesDurumu ="sesli";
        volume.classList = "fa-solid fa-volume-high";
        volumeBar.value = 100;
    }
} )

// ses kısma-açma ve bar göstergesi değişimi
volumeBar.addEventListener("input", (e) =>{
    const value = e.target.value; // e, inputun tıklanan değerini gösterir. 0-100 arasında
    audio.volume = value / 100; //  volume 0-1 arasında değerleri tanıdığı için 100 e böldük.
    if(value == 0){
        audio.muted = true; // ses 0 ise susturulup ikon değişsin
        sesDurumu = "sessiz";
        volume.classList = "fa-solid fa-volume-xmark";
    }else{
        audio.muted = false;    
        sesDurumu ="sesli";
        volume.classList = "fa-solid fa-volume-high";
    }
})

// açılır listeyi dinamikleştirme
const displayMusicList = (list) =>{
    for(let i =0; i < list.length; i++){
        let liTag = `
        <li li-index='${i}' onClick="selectedMusic(this)" class="list-group-item d-flex justify-content-between align-items-center">
            <span>${list[i].getName()}</span> 
            <span id="music-${i}" class="badge bg-primary rounded-pill"></span>
            <audio class ="music-${i}" src ="mp3/${list[i].file}"></audio>
        </li>
        `;
        ul.insertAdjacentHTML("beforeend", liTag);

        // alınan müziklerin süresini tutma
        let liAudioDuration = ul.querySelector(`#music-${i}`);
        let liAudioTag = ul.querySelector(`.music-${i}`);

        // yüklendiğinde her müziğin süresini hesapla.
        liAudioTag.addEventListener("loadeddata", () =>{
            liAudioDuration.innerText = calculateTime(liAudioTag.duration);
        })
    }
}

// seçili müzik çalsın ve işaretlensin
const selectedMusic = (li) =>{
    player.index = li.getAttribute("li-index"); 
    displayMusic(player.getMusic());
    playMusic();
    isPlayingNow();
}

// şarkı listesinde çalan şarkıya class eklenmesi.
const isPlayingNow = () =>{
    for(let li of ul.querySelectorAll("li")){
        if(li.classList.contains("playing")){
            li.classList.remove("playing");
        }
        if(li.getAttribute("li-index") == player.index){
            li.classList.add("playing");
        }
    }
}

audio.addEventListener("ended",()=>{
    nextMusic();
})