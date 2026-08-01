<script lang="ts">
  import Loader from "./lib/components/Loader.svelte";
  import AudioPlayer from "./lib/components/AudioPlayer.svelte";
  import CardModal from "./lib/components/CardModal.svelte";
  import GalaxyCanvas from "./lib/components/GalaxyCanvas.svelte";

  import { WORDS_DICT, PLANET_DATA, type PlanetData } from "./lib/data/words";

  let hasStarted = $state(false);
  let isAudioPlaying = $state(false);
  let selectedPlanet = $state<PlanetData | null>(null);
  let audioElement: HTMLAudioElement;

  let isLoading = $state(false);
  let progress = $state(0);

  let randomNum = $state(Math.floor(Math.random() * 4) + 1);

  async function handleStart() {
    isLoading = true;

    const imageUrls = [
        `./images/may${randomNum}.png`,
        `./images/together1.png`, 
        `./images/together2.png`,
        `./images/together3.png`, 
        `./images/together4.png`,
    ];

    let loadedCount = 0;
    const totalAssets = imageUrls.length + 1;

    const updateProgress = () => {
      loadedCount++;
      progress = Math.floor((loadedCount / totalAssets) * 100);
    };

    const imagePromises = imageUrls.map(url => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => { updateProgress(); resolve(true); };
        img.onerror = () => { updateProgress(); resolve(false); };
      });
    });

    const audioPromise = new Promise((resolve) => {
      audioElement = new Audio("./music/CarlaMorrison-Compartir.mp3"); 
      audioElement.loop = true;
      audioElement.preload = "auto";
      
      let isResolved = false;
      const done = () => {
        if (isResolved) return;
        isResolved = true;
        updateProgress();
        resolve(true);
      };

      audioElement.addEventListener('canplaythrough', done, { once: true });
      audioElement.onerror = done;
      audioElement.load();
      
      setTimeout(done, 3000);
    });

    await Promise.all([...imagePromises, audioPromise]);

    setTimeout(() => {
      hasStarted = true;
      isLoading = false;
      toggleAudio();
    }, 500);
  }

  function toggleAudio() {
      if (!audioElement) return;

      if (isAudioPlaying) {
          audioElement.pause();
          isAudioPlaying = false;
      } else {
          audioElement.play().catch(() => {});
          isAudioPlaying = true;
      }
  }
</script>

<main class="relative w-full h-screen bg-[#05020a] overflow-hidden">
  {#if !hasStarted}
    <Loader onStart={handleStart} {isLoading} {progress} />
  {:else}
    <AudioPlayer isPlaying={isAudioPlaying} {toggleAudio} />
    <GalaxyCanvas 
      words={WORDS_DICT} 
      planets={PLANET_DATA} 
      {randomNum}
      onSelectPlanet={(planet) => (selectedPlanet = planet)} 
    />
    <CardModal planet={selectedPlanet} onClose={() => (selectedPlanet = null)} />
  {/if}
</main>
