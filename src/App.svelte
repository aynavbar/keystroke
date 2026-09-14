<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    import StatCard from "./components/StatCard.svelte";

    let docHeading = $state("");
    let docBody = $state("");

    let isDialogOpen = $state(false);

    let wordCount = $derived(docBody.trim().split(/\s+/g).length)

    function clearDoc() {
        docHeading = "";
        docBody = "";
    }

    function openDialog() {
        isDialogOpen = true;
    }

    function closeDialog(event?: Event) {
        isDialogOpen = false;
    }

    function startNewSession() {
        clearDoc();
        closeDialog();
    }

    /**
     * Returns a timestamp in the 12 hour system plus the date
    */
    function formatTime(timestamp: Date): string {
        let isAM = true;
        const hour = (() => {
            const timestampHours = timestamp.getHours();
            /**
             * Changing from AM to PM with this logic ensures
             * midday isn't labelled as AM and anything after is converted to the
             * 12 hour system
            */
            if (timestampHours >= 12) { // anything from midday onwards get's labelled as PM
                isAM = false;
            };
            if (timestampHours >= 13) {
                return timestampHours - 12;
            }
            return timestampHours;
        })();

        const minutes = (() => {
            const timestampMinutes = timestamp.getMinutes();
            if (timestampMinutes >= 10) return timestampMinutes;
            return `0${timestampMinutes}`
        })();

        const month = (() => {
            const monthsLookup = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
            ];

            return monthsLookup[(timestamp.getMonth())];
        })();

        const formattedTime = `${hour}:${minutes} ${isAM ? 'AM' : 'PM'} · ${month} ${timestamp.getDate()}`;
        return formattedTime
    }

    onMount(() => {
        window.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && isDialogOpen) {
                closeDialog();
                return;
            }

            if (event.key === "Escape" && !isDialogOpen && docBody) {
                openDialog();
                return;
            }
        })
    })
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
    <div class="fab-container">
        <button onclick={openDialog} disabled={docBody ? false : true}>
            <span class="material-symbols-rounded">stop</span>
            <span>End session</span>
        </button>
    </div>
    {#if isDialogOpen}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div transition:fade={{duration: 70}} class="dialog-container" onclick={closeDialog}>
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <!-- svelte-ignore a11y_interactive_supports_focus -->
            <div class="dialog" role="dialog" onclick={(event) => {
                event.stopPropagation();
            }}>
                <header>
                    <h1>Session ended</h1>
                    <h2>{formatTime(new Date())}</h2>
                </header>
                <div class="stat-row">
                    <StatCard
                        data={wordCount}
                        label="Word count"
                    />
                </div>
                <footer>
                    <button onclick={closeDialog}>Close</button>
                    <button onclick={startNewSession}>Start new session</button>
                </footer>
            </div>
        </div>
    {/if}
</main>

<style>
    main {
        height: 100dvh;
        position: relative;
    }

    .background {
        height: 100%;
        background-color: var(--background);
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

    .fab-container {
        position: fixed;
        right: 2rem;
        bottom: 2rem;
    }

    .fab-container button {
        padding-inline: 1.1rem;
        padding-block: 0.7rem;
        border-radius: 50px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .fab-container button span {
        color: var(--on-accent);
    }

    .fab-container button span.material-symbols-rounded {
        font-size: 1.5rem;
    }

    .dialog-container {
        position: fixed;
        top: 0;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .dialog-container .dialog {
        width: 35rem;
        background-color: var(--secondary-background);
        border-radius: 1rem;
        border: var(--border);
        padding: 1rem;
    }

    .dialog header h1 {
        font-size: 0.8rem;
        font-weight: 500;
        color: var(--secondary-text);
        padding-bottom: 1rem;
    }

    .dialog header h2 {
        font-size: 1.2rem;
    }

    .dialog .stat-row {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        padding-block: 1rem;
    }

    .dialog footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }

    .dialog footer button {
        padding-inline: 0.5rem;
        padding-block: 0.6rem;
        border-radius: 8px;
    }

    .dialog footer button:nth-child(1) {
        background: none;
        transition: background-color 0.2s ease;
    }

    .dialog footer button:nth-child(1):hover {
        background-color: #2c2c2c52;
    }

    .dialog footer button:nth-child(2) {
        background-color: var(--accent);
        color: var(--on-accent);
    }
</style>
