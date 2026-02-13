<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import { alertStore } from "../lib/stores/alerts";
    import { AlertType } from "../lib/constants";
</script>

{#if $alertStore}
    <div
        class="alert"
        class:bg-zinc-700={$alertStore.type === AlertType.INFO}
        class:bg-amber-600={$alertStore.type === AlertType.WARNING}
        class:bg-rose-800={$alertStore.type === AlertType.ERROR}
        in:fly={{ x: 200, duration: 500 }}
        out:fade={{ duration: 500 }}
    >
        {@html $alertStore.message}
    </div>
{/if}

<style>
    .alert {
        position: fixed;
        z-index: 100;
        bottom: 10px;
        right: 10px;
        margin-left: 10px;
        padding: 10px 20px;
        border-radius: 10px;
        color: white;
    }
</style>