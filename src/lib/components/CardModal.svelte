<script lang="ts">
    import { X, Heart } from "@lucide/svelte";
    import type { PlanetData } from "../data/words";

    interface Props {
        planet: PlanetData|null;
        onClose: () => void;
    }

    let { planet, onClose }: Props = $props();
</script>

{#if planet}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        
        <div class="relative w-full max-w-md bg-[#12071f] border border-pink-500/40 rounded-2xl p-6 shadow-2xl shadow-pink-500/20 text-pink-100 flex flex-col gap-4">
      
            <button 
                onclick={onClose} 
                class="absolute top-4 right-4 p-1 rounded-full text-pink-300/70 hover:text-white hover:bg-pink-900/40 transition-colors cursor-pointer"
            >
                <X class="w-6 h-6" />
            </button>

            {#if planet.image}
                <div class="w-full h-48 rounded-xl overflow-hidden border border-pink-500/20 bg-pink-950/30">
                <img src={planet.image} alt={planet.title} class="w-full h-full object-cover" />
                </div>
            {/if}

            <div class="flex items-center gap-2 text-pink-400 font-bold text-xl">
                <Heart class="w-5 h-5 fill-pink-500 text-pink-500" />
                <h2>{planet.title}</h2>
            </div>

            <p class="text-pink-100/80 leading-relaxed text-sm md:text-base">
                {planet.description}
            </p>

            <button
                onclick={onClose}
                class="mt-2 w-full py-2.5 bg-pink-600/30 hover:bg-pink-600/50 border border-pink-500/50 text-pink-200 rounded-xl font-medium transition-all cursor-pointer"
            >
                Cerrar carta
            </button>
        </div>
    </div>
{/if}
