<script lang="ts">
    import { Music, VolumeX } from "@lucide/svelte";

    interface Props {
        isPlaying?: boolean;
        toggleAudio: () => void;
    }

    let { isPlaying = false, toggleAudio }: Props = $props();
</script>

<button
    onclick={toggleAudio}
    class="fixed top-5 right-5 z-40 p-3 bg-pink-950/60 border border-pink-500/40 text-pink-300 rounded-full backdrop-blur-md shadow-lg shadow-pink-900/30 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
    title={isPlaying ? "Pausar música" : "Reproducir música"}
>
    {#if isPlaying}
        <Music class="w-6 h-6 animate-spin" style="animation-duration: 4s;" />
    {:else}
        <VolumeX class="w-6 h-6 text-pink-400/50" />
    {/if}
</button>
