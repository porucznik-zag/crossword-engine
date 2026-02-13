<script lang="ts">
  import { fade, fly, scale } from "svelte/transition";
  import { LETTERS, ConstraintType } from '../lib/constants';
  import { searchStore } from '../lib/stores/search';
  import { settingsStore } from '../lib/stores/settings';
  import { countDots } from '../lib/utils';

  let contextMenu = {
    visible: false,
    x: 0,
    y: 0,
    targetIndex: -1
  };

  let longPressTimer: number;

  function handleLetterClick(letter: string) {
    settingsStore.toggleLetter(letter, countDots($searchStore.expression));
  }

  function handleClearAll() {
    settingsStore.clearLetters();
    searchStore.clearConstraints();
  }

  // --- Obsługa Menu Kontekstowego ---

  function handleRightClick(e: MouseEvent, index: number) {
    e.preventDefault(); // Ważne: blokuje natywne menu
    openMenu(e.clientX, e.clientY, index);
  }

  function handleTouchStart(e: TouchEvent, index: number) {
    clearTimeout(longPressTimer);
    longPressTimer = setTimeout(() => {
      const touch = e.touches[0];
      openMenu(touch.clientX, touch.clientY, index);
    }, 500);
  }

  function handleTouchEnd() {
    clearTimeout(longPressTimer);
  }

  function openMenu(clientX: number, clientY: number, index: number) {
    const menuWidth = 180;
    const menuHeight = 160;
    
    let x = clientX;
    let y = clientY;

    // Jeśli menu wyjdzie za prawą krawędź, przesuń je w lewo
    if (x + menuWidth > window.innerWidth) {
      x -= menuWidth;
    }

    // Jeśli menu wyjdzie za dolną krawędź, przesuń je w górę
    if (y + menuHeight > window.innerHeight) {
      y -= menuHeight;
    }

    contextMenu = {
      visible: true,
      x,
      y,
      targetIndex: index
    };
  }

  function closeMenu() {
    contextMenu.visible = false;
  }

  function setConstraint(type: ConstraintType) {
    if (contextMenu.targetIndex !== -1) {
      searchStore.setConstraint(contextMenu.targetIndex, type);
    }
    closeMenu();
  }

  function getTileClasses(index: number, char: string, constraints: Map<number, ConstraintType>) {
    const baseClasses = "border-2 transition-colors duration-300";

    // Jeśli to litera wpisana w input (np. "A"), a nie kropka
    if (char !== ".") {
        return `${baseClasses} border-zinc-600 bg-zinc-800 text-zinc-400`; 
    }
    
    const type = constraints.get(index);
    
    // Samogłoska (Czerwony)
    if (type === ConstraintType.VOWEL) {
        return `${baseClasses} border-red-400`;
    }
    
    // Spółgłoska (Niebieski)
    if (type === ConstraintType.CONSONANT) {
        return `${baseClasses} border-sky-400`;
    }
    
    // Zwykła kropka (Domyślny)
    return `${baseClasses} border-zinc-700 bg-zinc-700 hover:border-zinc-300`;
  }
</script>


<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
  class="context-menu-overlay w-full h-dvh p-10 py-5 fixed top-0 left-0 flex items-center justify-center z-50"  
  on:click={() => { settingsStore.close(); closeMenu(); }}
  in:fade={{ duration: 500 }}
  out:fade={{ duration: 300 }}
  on:contextmenu|preventDefault
>
  <div 
    class="w-full max-w-2xl h-fit bg-zinc-800 p-6 rounded-lg flex flex-col flex-wrap items-center justify-center shadow-2xl" 
    on:click|stopPropagation={closeMenu} 
  >
    <div class="w-full flex flex-col items-center justify-center gap-2">
      <div class="text-zinc-400">Wybierz rodzaj litery</div>
      <div class="flex flex-wrap flex-row justify-center items-center gap-1 text-zinc-100">
        {#each $searchStore.expression as object, index}
          <div 
            class="w-8 h-8 rounded-sm flex items-center justify-center text-center select-none transition-colors duration-300 bg-zinc-700 no-native-menu {getTileClasses(index, object, $searchStore.constraints)}"
            transition:fly={{ duration: 800 }}
            on:contextmenu|preventDefault={(e) => object === "." && handleRightClick(e, index)}
            on:touchstart={(e) => object === "." && handleTouchStart(e, index)}
            on:touchend={handleTouchEnd}
            on:touchmove={handleTouchEnd}
          >
            {object === "." ? "" : object}
          </div> 
        {/each}
      </div>
      <div class="w-full flex items-start justify-center mt-1 text-sm px-2 text-zinc-500 select-none">
        <svg fill="currentColor" class="w-4 h-4 mr-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M15,16.372a7.5,7.5,0,1,0-6,0V18h6ZM11.221,6.087a3.5,3.5,0,0,0-2.7,3.023,1,1,0,0,1-.992.89,1.065,1.065,0,0,1-.112-.006,1,1,0,0,1-.884-1.1,5.5,5.5,0,0,1,4.246-4.754,1,1,0,0,1,.442,1.951ZM9,20h6v1a1,1,0,0,1-1,1H10a1,1,0,0,1-1-1Z"/>
        </svg>
        <p class="text-xs">Przytrzymaj lub kliknij PPM na puste pole, aby wybrać rodzaj</p>
      </div>  
        <div class="w-full flex items-start justify-center gap-1 text-zinc-500 select-none">
          <svg class="w-4 h-4 aspect-square stroke-red-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke-width="2">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p class="text-xs text-red-300">Samogłoska</p>
          <div class="w-2"></div>
          <svg class="w-4 h-4 aspect-square stroke-sky-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke-width="2">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p class="text-xs text-sky-300">Spółgłoska</p>
        </div>  
    </div>

    <div class="w-full h-0.5 bg-zinc-700 mt-4 mb-4"></div>

    <div class="w-full flex flex-col items-center justify-center gap-3">
      <div class="text-zinc-400">Wybierz wymagane litery</div>
      <div 
        class="w-fit h-fit grid grid-cols-6 sm:grid-cols-8 gap-2 justify-items-center"
        on:click|stopPropagation
      >
        {#each LETTERS as letter}
          <div 
            class="w-9 h-9 rounded-sm flex items-center justify-center text-center border-2 hover:border-zinc-300 transition duration-300 cursor-pointer select-none" 
            class:border-amber-500={$settingsStore.mustContainLetters.includes(letter)}
            class:border-zinc-700={!$settingsStore.mustContainLetters.includes(letter)}
            class:bg-amber-500={$settingsStore.mustContainLetters.includes(letter)}
            class:bg-zinc-700={!$settingsStore.mustContainLetters.includes(letter)}
            on:click={() => handleLetterClick(letter)}
          >
            {letter}
          </div>
        {/each}
      </div>
      
      <div class="flex flex-row gap-3 items-center justify-center w-full h-fit mt-1">
        <button class="bg-zinc-700 px-6 py-2 rounded-lg border-2 border-zinc-700 hover:border-zinc-300 transition duration-300 cursor-pointer select-none" on:click={handleClearAll}>
          Wyczyść
        </button>
        <button class="bg-zinc-700 px-6 py-2 rounded-lg border-2 border-zinc-700 hover:border-zinc-300 transition duration-300 cursor-pointer select-none" on:click={settingsStore.close}>
          Gotowe
        </button>
      </div>
    </div>
  </div>
</div>


{#if contextMenu.visible}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div 
    class="fixed z-60 bg-zinc-800 border border-zinc-600 rounded-md shadow-xl overflow-hidden min-w-45"
    style="top: {contextMenu.y}px; left: {contextMenu.x}px;"
    transition:scale={{ duration: 100, start: 0.9 }}
    on:click|stopPropagation
    on:contextmenu|preventDefault
  >
    <div class="flex flex-col text-sm text-zinc-300">
       <button 
        class="flex items-center gap-3 px-4 py-3 hover:bg-zinc-700 text-left transition"
        on:click={() => setConstraint(ConstraintType.NONE)}
      >
        <div class="w-4 h-4 border-2 border-zinc-300 rounded-sm flex items-center justify-center">
            {#if !$searchStore.constraints.has(contextMenu.targetIndex)}
                <div class="w-2 h-2 bg-zinc-300 rounded-[1px]"></div>
            {/if}
        </div>
        <span>Brak</span>
      </button>

      <button 
        class="flex items-center gap-3 px-4 py-3 hover:bg-zinc-700 text-left transition text-red-400"
        on:click={() => setConstraint(ConstraintType.VOWEL)}
      >
        <div class="w-4 h-4 border-2 border-red-400 rounded-sm flex items-center justify-center">
             {#if $searchStore.constraints.get(contextMenu.targetIndex) === ConstraintType.VOWEL}
                <div class="w-2 h-2 bg-red-400 rounded-[1px]"></div>
            {/if}
        </div>
        <span>Samogłoska</span>
      </button>

      <button 
        class="flex items-center gap-3 px-4 py-3 hover:bg-zinc-700 text-left transition text-sky-400"
        on:click={() => setConstraint(ConstraintType.CONSONANT)}
      >
        <div class="w-4 h-4 border-2 border-sky-400 rounded-sm flex items-center justify-center">
            {#if $searchStore.constraints.get(contextMenu.targetIndex) === ConstraintType.CONSONANT}
                <div class="w-2 h-2 bg-sky-400 rounded-[1px]"></div>
            {/if}
        </div>
        <span>Spółgłoska</span>
      </button>
    </div>
  </div>
  
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="fixed inset-0 z-55" on:click={closeMenu} on:contextmenu|preventDefault></div>
{/if}


<style>
  .context-menu-overlay {
    background-color: hsla(0, 0%, 0%, 0.5);
    backdrop-filter: blur(2px);
  }

  .no-native-menu {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
</style>