<script lang="ts">
    import { slide } from "svelte/transition";

    interface toastProps {
      message: string
      type: "success" | "error"
    }

    let { message, type = "success" }: toastProps = $props();
</script>

<div class="copy-info-toast-container {type}" transition:slide={{axis: "y"}}>
    <div class="copy-info">
        <p class="inter-400">{message}</p>
    </div>
</div>

<style>
    .copy-info-toast-container {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 4rem;
        inset-inline: 0;
        display: flex;
        align-items: center;
        z-index: 999999;
    }

    .copy-info-toast-container.success {
        background-color: #e2ffe2;
    }

    .copy-info-toast-container.error {
        background-color: #ffe2e2;
    }

    .copy-info-toast-container .copy-info {
        color: green;
        height: fit-content;
        background-color: transparent;
        padding-inline-start: 2rem;
    }

    .copy-info-toast-container.success .copy-info {
        color: green;
    }

    .copy-info-toast-container.error .copy-info {
        color: red;
    }

    .copy-info p {
        background-color: transparent;
    }
</style>
