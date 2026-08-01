<script lang="ts">
    import { Sparkles, Heart } from "@lucide/svelte";

    interface Props {
        onStart: () => void;
        isLoading: boolean;
        progress: number;
    }

    let { onStart, isLoading, progress }: Props = $props();
</script>

<div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080311] text-pink-100 p-6 text-center select-none overflow-hidden">
    <div class="absolute inset-0 pointer-events-none" style="background: radial-gradient(circle at center, rgba(219, 39, 119, 0.25) 0%, rgba(8, 3, 17, 0) 70%);"></div>

    <div class="relative z-10 flex flex-col items-center max-w-md">
        <div class="p-3 bg-pink-950/40 border border-pink-500/30 rounded-full mb-6 text-pink-400 shadow-lg shadow-pink-500/20">
            <Sparkles class="w-8 h-8 animate-pulse" />
        </div>

        <h1 
            class="text-3xl md:text-5xl font-extrabold tracking-tight bg-linear-to-r from-pink-300 via-rose-300 to-pink-500 mb-4"
            style="-webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: transparent;"
        >
            Feliz Día de la Novia mi Niña
        </h1>

        <p class="text-pink-200/70 text-sm md:text-base mb-8 max-w-xs">
            Un universo hecho solo para ti :D
        </p>

        {#if !isLoading}
            <button
                onclick={onStart}
                class="group relative inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-pink-600 to-rose-500 text-white font-semibold rounded-full shadow-lg shadow-pink-600/30 hover:shadow-pink-600/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
                <span>click aquí mi princesa</span>
                <Heart class="w-5 h-5 fill-white group-hover:scale-125 transition-transform duration-300" />
            </button>
        {:else}
            <div class="w-full max-w-xs flex flex-col items-center gap-3 animate-fade-in">
                <span class="text-pink-300 font-medium text-sm animate-pulse">
                    Cargando nuestro universo... {progress}%
                </span>
                <div class="w-full h-2 bg-pink-950/50 rounded-full overflow-hidden border border-pink-500/30">
                    <div 
                        class="h-full bg-linear-to-r from-pink-500 to-rose-400 transition-all duration-300 ease-out" 
                        style="width: {progress}%">
                    </div>
                </div>
            </div>
        {/if}

        
    </div>
</div>
