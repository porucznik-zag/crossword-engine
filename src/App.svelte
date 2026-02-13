<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from "svelte/transition";
  import Alert from './components/Alert.svelte';
  import Settings from './components/Settings.svelte';
  
  // Import Stores
  import { searchStore } from './lib/stores/search';
  import { settingsStore } from './lib/stores/settings';
  import { countDots } from './lib/utils';

  let inputElement: HTMLInputElement;
  let showScrollTop: boolean = false;

  // Inicjalizacja nasłuchiwania URL przy starcie
  onMount(() => {
    searchStore.init();
  });

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    searchStore.setExpression(target.value);
  }

  function handleEnterKey(event: KeyboardEvent) {
    if (event.key === "Enter") {
      inputElement.blur();
      searchStore.execute();
    }
  }

  function handleWindowScroll() {
    // Pokaż przycisk, jeśli przewinięto więcej niż 300 pikseli
    showScrollTop = window.scrollY > 300;
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function handleGlobalKeydown(event: KeyboardEvent) {
  if (event.shiftKey && (event.key === 'S' || event.key === 's')) {
    if (document.activeElement !== inputElement) {
      event.preventDefault();
      
      if (inputElement) {
        // 1. Ustaw focus
        inputElement.focus();
        
        // 2. Przewiń płynnie do inputa
        inputElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }
    }
  }
}
</script>

<svelte:window 
  on:scroll={handleWindowScroll} 
  on:keydown={handleGlobalKeydown} 
/>

<main class="w-full h-fit min-h-dvh bg-zinc-900 text-zinc-300 flex flex-col items-center justify-between box-border">
  <div class="w-full py-12 flex flex-col items-center justify-center px-5 gap-2">
      <p class="h-16 flex items-center justify-center text-3xl md:text-4xl text-center select-none">WYSZUKAJ HASŁA</p>
      
      <div class="w-full max-w-lg min-w-50 flex flex-row gap-2 items-start justify-center">
        <div class="w-full flex flex-col items-center">
          <div class="relative w-full">
            <input 
              type="text" 
              bind:this={inputElement}
              value={$searchStore.expression}
              on:input={handleInput}
              on:keydown={handleEnterKey} 
              maxlength="13" 
              class="w-full pl-3 pr-10 py-2 bg-transparent placeholder:text-zinc-600 placeholder:select-none text-zinc-100 text-lg tracking-wide border-2 border-zinc-600 rounded-md transition duration-300 ease focus:outline-none focus:border-zinc-400 shadow-sm focus:shadow" 
              placeholder="Podaj wzorzec" 
            />
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button 
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:bg-zinc-400 hover:text-zinc-800 rounded-md transition-colors duration-300" 
              on:click={searchStore.clear}
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="w-full flex items-start mt-1 text-sm px-2 text-zinc-500 select-none">
            <svg fill="currentColor" class="w-5 h-5 mr-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M15,16.372a7.5,7.5,0,1,0-6,0V18h6ZM11.221,6.087a3.5,3.5,0,0,0-2.7,3.023,1,1,0,0,1-.992.89,1.065,1.065,0,0,1-.112-.006,1,1,0,0,1-.884-1.1,5.5,5.5,0,0,1,4.246-4.754,1,1,0,0,1,.442,1.951ZM9,20h6v1a1,1,0,0,1-1,1H10a1,1,0,0,1-1-1Z"/>
            </svg>
            <p>Wpisz hasło lub jego wzorzec, zastępując znakiem <span class="w-4 h-5 border rounded-md border-transparent mx-0.5 inline-flex items-center justify-center text-center bg-zinc-800">.</span> dowolną literę</p>
          </div>  
        </div> 
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button class="w-12 h-12 text-zinc-500 hover:text-amber-500 transition-colors duration-300" on:click={() => searchStore.execute()}>
          <svg class="w-12 aspect-square" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.25007 2.38782C8.54878 2.0992 10.1243 2 12 2C13.8757 2 15.4512 2.0992 16.7499 2.38782C18.06 2.67897 19.1488 3.176 19.9864 4.01358C20.824 4.85116 21.321 5.94002 21.6122 7.25007C21.9008 8.54878 22 10.1243 22 12C22 13.8757 21.9008 15.4512 21.6122 16.7499C21.321 18.06 20.824 19.1488 19.9864 19.9864C19.1488 20.824 18.06 21.321 16.7499 21.6122C15.4512 21.9008 13.8757 22 12 22C10.1243 22 8.54878 21.9008 7.25007 21.6122C5.94002 21.321 4.85116 20.824 4.01358 19.9864C3.176 19.1488 2.67897 18.06 2.38782 16.7499C2.0992 15.4512 2 13.8757 2 12C2 10.1243 2.0992 8.54878 2.38782 7.25007C2.67897 5.94002 3.176 4.85116 4.01358 4.01358C4.85116 3.176 5.94002 2.67897 7.25007 2.38782ZM9 11.5C9 10.1193 10.1193 9 11.5 9C12.8807 9 14 10.1193 14 11.5C14 12.8807 12.8807 14 11.5 14C10.1193 14 9 12.8807 9 11.5ZM11.5 7C9.01472 7 7 9.01472 7 11.5C7 13.9853 9.01472 16 11.5 16C12.3805 16 13.202 15.7471 13.8957 15.31L15.2929 16.7071C15.6834 17.0976 16.3166 17.0976 16.7071 16.7071C17.0976 16.3166 17.0976 15.6834 16.7071 15.2929L15.31 13.8957C15.7471 13.202 16 12.3805 16 11.5C16 9.01472 13.9853 7 11.5 7Z" fill="currentColor"/>
          </svg>
        </button> 
        <div class="w-11 h-12 p-0 m-0 flex juxtify-center items-center">
          {#if $searchStore.expression.includes(".")}
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <button class="w-fit h-12 p-0 m-0 flex justify-center items-center text-zinc-500 hover:text-amber-500 transition-colors duration-300" on:click={settingsStore.open}>
              <svg class="w-9 aspect-square" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="66.667 50 666.667 666.667" on:click={settingsStore.open}>
                <path d=" M 400 716.667 C 242.865 716.667 164.298 716.667 115.482 667.85 C 66.667 619.037 66.667 540.467 66.667 383.333 C 66.667 226.198 66.667 147.631 115.482 98.816 C 164.298 50 242.865 50 400 50 C 557.133 50 635.703 50 684.517 98.816 C 733.333 147.631 733.333 226.198 733.333 383.333 C 733.333 540.467 733.333 619.037 684.517 667.85 C 635.703 716.667 557.133 716.667 400 716.667 L 400 716.667 Z  M 400 443.649 C 433.565 443.649 460.774 416.646 460.774 383.333 C 460.774 350.021 433.565 323.018 400 323.018 C 366.434 323.018 339.225 350.021 339.225 383.333 C 339.225 416.646 366.434 443.649 400 443.649 L 400 443.649 Z  M 435.763 185.342 C 428.318 182.281 418.879 182.281 400 182.281 C 381.121 182.281 371.682 182.281 364.237 185.342 C 354.309 189.423 346.421 197.251 342.309 207.103 C 340.432 211.601 339.697 216.832 339.41 224.462 C 338.987 235.674 333.193 246.053 323.402 251.663 C 313.611 257.273 301.658 257.063 291.662 251.82 C 284.861 248.252 279.929 246.268 275.066 245.633 C 264.412 244.241 253.637 247.106 245.112 253.598 C 238.718 258.467 233.999 266.58 224.559 282.806 C 215.12 299.031 210.401 307.144 209.349 315.074 C 207.946 325.647 210.833 336.341 217.375 344.802 C 220.361 348.664 224.557 351.909 231.069 355.97 C 240.644 361.941 246.804 372.113 246.804 383.333 C 246.803 394.554 240.643 404.723 231.069 410.693 C 224.556 414.756 220.359 418.003 217.373 421.865 C 210.831 430.325 207.944 441.017 209.347 451.591 C 210.399 459.52 215.118 467.635 224.557 483.86 C 233.997 500.084 238.716 508.199 245.11 513.066 C 253.635 519.558 264.41 522.423 275.064 521.032 C 279.927 520.397 284.858 518.412 291.659 514.846 C 301.655 509.602 313.61 509.393 323.401 515.003 C 333.193 520.614 338.987 530.992 339.41 542.207 C 339.697 549.835 340.432 555.066 342.309 559.564 C 346.421 569.415 354.309 577.244 364.237 581.326 C 371.682 584.386 381.121 584.386 400 584.386 C 418.879 584.386 428.318 584.386 435.763 581.326 C 445.691 577.244 453.578 569.415 457.69 559.564 C 459.568 555.066 460.303 549.835 460.591 542.205 C 461.013 530.992 466.805 520.614 476.597 515.003 C 486.388 509.391 498.343 509.602 508.339 514.846 C 515.14 518.412 520.07 520.395 524.934 521.03 C 535.587 522.423 546.362 519.558 554.887 513.066 C 561.282 508.197 566.001 500.084 575.44 483.858 C 584.88 467.633 589.598 459.52 590.652 451.591 C 592.053 441.017 589.166 430.323 582.626 421.863 C 579.638 418.001 575.442 414.754 568.928 410.693 C 559.356 404.723 553.196 394.552 553.196 383.331 C 553.196 372.111 559.356 361.943 568.928 355.974 C 575.444 351.911 579.64 348.666 582.628 344.802 C 589.168 336.342 592.055 325.649 590.654 315.075 C 589.6 307.146 584.882 299.033 575.442 282.807 C 566.003 266.582 561.284 258.469 554.889 253.6 C 546.364 247.107 535.59 244.242 524.936 245.634 C 520.072 246.27 515.14 248.253 508.341 251.821 C 498.345 257.064 486.39 257.274 476.599 251.663 C 466.807 246.053 461.013 235.674 460.589 224.461 C 460.301 216.831 459.568 211.601 457.69 207.103 C 453.578 197.251 445.691 189.423 435.763 185.342 L 435.763 185.342 Z " fill-rule="evenodd" fill="currentColor"/>
              </svg>
            </button> 
          {/if}
        </div>
      </div>

      <div class="w-full max-w-lg min-w-50 h-16 pb-2 flex flex-wrap flex-row justify-center items-end gap-1 text-zinc-100">
        {#each $searchStore.expression as object}
          <div 
            class="w-8 h-8 rounded-sm flex items-center justify-center text-center bg-zinc-700 select-none"
            transition:fly={{ duration: 800 }}
          >
            {object === "." ? "" : object}
          </div> 
        {/each}
      </div>

      <div class="w-full flex flex-col justify-center items-center text-zinc-500">
        {#if $settingsStore.mustContainLetters.length > 0 || $searchStore.constraints.size > 0}
          <div 
            class="w-full flex flex-row justify-center items-center gap-1"
            transition:fade={{ duration: 500 }}
          >
            <div>Ustawienia zaawansowane</div> 
            <div class="text-[10px] uppercase tracking-wider bg-zinc-800 text-amber-500 border border-amber-500 px-1.5 py-1 text-sm rounded-sm select-none">
              Aktywne
            </div>
          </div>
        {/if}
      </div>

      {#if $searchStore.isLoading}
        <div transition:fade={{ duration: 300 }} class="text-zinc-500 py-2 flex justify-center items-center flex-col">
          <p class="blink">Ładowanie danych...</p>
        </div>
      {:else}
           <div 
            class="w-full h-fit md:px-20 flex flex-col justify-center items-center gap-4 text-amber-500"
            transition:fade={{ duration: 300 }}
          >
             {#each $searchStore.results as object}
               <div class=" w-full flex flex-col items-start justify-start px-4 py-4 gap-">
                 <div class="w-fit flex items-center justify-start py-0.5 pl-1 pr-4 border-b-2 border-b-zinc-500 text-xl tracking-widest">
                   {object.word}
                 </div>
                 <ul class="flex flex-col gap-1 py-1 px-1 text-sm tracking-wide text-zinc-500 space-y-1 list-disc list-inside">
                  {#each object.definitions as definition}
                    <li>{definition}</li>
                  {/each}
                 </ul>
               </div>
             {/each}
           </div>
      {/if}
  </div>

  <div class="w-full h-fit py-3 bg-zinc-800 flex flex-wrap items-center justify-center gap-2 md:gap-10 md:py-4 text-zinc-500 text-sm">
    <div class="flex flex-row items-center justify-center gap-1">
      <svg class="w-3 h-3" fill="currentColor" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
        viewBox="0 0 367.467 367.467" xml:space="preserve">
        <g>
          <path d="M183.73,0.018C82.427,0.018,0,82.404,0,183.733c0,101.289,82.427,183.716,183.73,183.716
            c101.315,0,183.737-82.427,183.737-183.716C367.467,82.404,285.045,0.018,183.73,0.018z M183.73,326.518
            c-78.743,0-142.798-64.052-142.798-142.784c0-78.766,64.055-142.817,142.798-142.817c78.752,0,142.807,64.052,142.807,142.817
            C326.536,262.466,262.481,326.518,183.73,326.518z"/>
          <path d="M244.036,217.014c-11.737,20.141-33.562,32.635-56.956,32.635c-36.329,0-65.921-29.585-65.921-65.915
            c0-36.36,29.592-65.955,65.921-65.955c23.395,0,45.219,12.54,56.956,32.641l1.517,2.627h44.28l-2.658-7.129
            c-7.705-20.413-21.225-37.769-39.122-50.157c-17.942-12.42-39.017-19.009-60.973-19.009c-58.981,0-106.946,48.006-106.946,106.982
            c0,58.98,47.965,106.941,106.946,106.941c21.956,0,43.03-6.567,60.973-19.006c17.897-12.391,31.417-29.741,39.122-50.154
            l2.658-7.133h-44.28L244.036,217.014z"/>
        </g>
      </svg>
      <div>Kamil Zagórski 2025</div>
    </div>

    <div class="flex flex-row items-center justify-center gap-1 text-xs">
      <p>
        Baza wyrazów zaczerpnięta z 
        <a 
          href="https://krzyzowkowo.pl" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="w-26 h-6 border rounded-md border-transparent mx-1 inline-flex items-center justify-center text-center bg-zinc-900 hover:bg-zinc-400 hover:text-zinc-800 hover:cursor-pointer transition duration-300"
        >
          krzyzowkowo.pl
        </a>
      </p>
    </div>
  </div>
</main> 

{#if $settingsStore.isOpen}
  <Settings />
{/if}

{#if showScrollTop}
  <button 
    on:click={scrollToTop}
    transition:fly={{ y: 20, duration: 300 }}
    class="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-zinc-700 text-zinc-400 shadow-lg cursor-pointer hover:bg-amber-500 hover:text-zinc-900 transition-all duration-300"
    aria-label="Przewiń do góry"
  >
    <svg class="w-6 h-6 aspect-square" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="3">
      <path d="M12 5V19M12 5L6 11M12 5L18 11"stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button> 
{/if}

<Alert />


<style>
  @keyframes blink {
    10% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  .blink {
    animation: blink 1s ease-in-out infinite alternate-reverse;
  }
</style>