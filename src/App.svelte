<script lang="ts">
    let docHeading = $state("");
    let docBody = $state("");
</script>

<main>
    <div class="background"></div>
    <div class="input-controls-container">
        <input bind:value={docHeading} type="text" id="heading" placeholder="Untitled">
        <textarea
        bind:value={docBody}
        id="body"
        placeholder="Start writing..."
        spellcheck="false"
        ></textarea>
    </div>
</main>

<style>
    main {
        height: 100dvh;
        position: relative;
    }

    .background {
        height: 100%;
        background-color: #000000;
    }

    .input-controls-container {
        position: absolute;
        top: 0;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .input-controls-container textarea, .input-controls-container input {
        border: none;
        outline: none;
        padding-inline: clamp(2rem, 10vw, 6rem);
        padding-block-start: 0.6rem;
        padding-block-end: 1rem;
        background-color: transparent;
    }

    .input-controls-container input {
        font-size: 2rem;
        font-weight: 700;
    }

    .input-controls-container textarea {
        resize: none;
        flex: 1;
        font-size: 1.4rem;
        font-weight: 500;
        line-height: 2rem;
        scrollbar-width: none;
    }
</style>
