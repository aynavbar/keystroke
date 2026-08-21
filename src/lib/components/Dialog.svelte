<script>
    import { fade } from "svelte/transition";

    import { trapFocus } from "../attachments.svelte";

    import { sessionEndState } from "../store.svelte";

    import Button from "./Button.svelte";

    let { sessionAverageWPM, sessionTimeInMinutes, sessionWordCount } = $props();
</script>

<div class="end-session-dialog-surface" {@attach trapFocus} transition:fade={{duration: 50}}>
    <div class="end-session-dialog-content">
        <h1 class="inter-700">End this session ?</h1>
        <p class="inter-500">{sessionWordCount} words • {sessionTimeInMinutes} minute{sessionTimeInMinutes === 1 ? '' : 's'} • {sessionAverageWPM === Infinity ? 0 : sessionAverageWPM} wpm</p>
        <div class="actions-row">
            <Button
                variant="outlined"
                onclick={() => {
                  sessionEndState.showEndSessionDialog = false
                }}
            >Keep writing</Button>
            <Button onclick={() => {
              sessionEndState.endSession = true
              sessionEndState.showEndSessionDialog = false
              sessionEndState.showSessionAnalytics = true
            }}>End session</Button>
        </div>
    </div>
</div>

<style>
    .end-session-dialog-surface {
        position: fixed;
        background-color: #00000030;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    }

    .end-session-dialog-content {
        width: 25rem;
        padding: 1.4rem;
        margin-inline: 1rem;
        background-color: #fff;
        border-radius: 0.6rem;
    }

    .end-session-dialog-content h1 {
        font-size: 1.1rem;
        font-weight: 600;
    }

    .end-session-dialog-content p {
        padding-block: 0.5rem;
        font-size: 0.8rem;
        color: #8a8a8a;
    }

    .end-session-dialog-content .actions-row {
        display: flex;
        gap: 5px;
        justify-content: flex-end;
    }
</style>
