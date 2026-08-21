<script>
    import { trapFocus } from "../attachments.svelte";

    import { sessionEndState, sessionTypingState } from "../store.svelte";

    import Button from "./Button.svelte";

    let formattedMinutes = $derived(
      `${sessionTypingState.startTime.getMinutes() < 10 ? `0${sessionTypingState.startTime.getMinutes()}`: sessionTypingState.startTime.getMinutes()}`
    ) // 00 formatting for minutes
</script>

<div class="session-analytics-container" {@attach trapFocus}>
    <div class="session-analytics-card">
        <div class="heading">
            <p>Today, {sessionTypingState.startTime ? sessionTypingState.startTime.getHours() : ''}:{sessionTypingState.startTime ? formattedMinutes: ''}</p>
        </div>
        <div class="at-a-glance">
            <div>
                <p class="label">Duration (minutes)</p>
                <p class="data">{sessionTypingState.timeInMinutes}</p>
            </div>
            <div>
                <p class="label">Average wpm</p>
                <p class="data">{sessionTypingState.averageWPM === Infinity ? 0 : sessionTypingState.averageWPM}</p>
            </div>
            <div>
                <p class="label">Backspaces</p>
                <p class="data">{sessionTypingState.eraseCount}</p>
            </div>
        </div>
        <div class="graph-area">
            <div class="graph-content to-be-implemented">
                <p>Graph feature in the upcoming release.</p>
            </div>
        </div>
    </div>
    <Button
        onclick={() => {
          sessionEndState.showSessionAnalytics = false;
          sessionTypingState.startTime = null // reset the timer and await timer start trigger
          sessionTypingState.averageWPM = 0
          sessionTypingState.eraseCount = 0
        }}
    >
        Start new session
    </Button>
</div>

<style>
    .session-analytics-container {
        position: fixed;
        z-index: 99999;
        width: 100%;
        height: 100%;
        background-color: #fdfcfc;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: center;
        align-items: center;
    }

    .session-analytics-card {
        width: 50rem;
        height: 25rem;
        display: flex;
        flex-direction: column;
        border: 1px solid #cecece;
        border-radius: 0.9rem;
        font-family: "Inter", sans-serif;
    }

    .session-analytics-card .heading {
        display: flex;
        padding-inline: 2rem;
        padding-block-start: 1.3rem;
    }

    .session-analytics-card .heading p {
        font-weight: 500;
    }

    .session-analytics-card .at-a-glance {
        display: flex;
        justify-content: space-between;
        padding: 2rem;
    }

    .session-analytics-card .at-a-glance div {
        background-color: #dedede;
        width: 10rem;
        height: 4rem;
        padding: 0.6rem;
        border-radius: 0.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .session-analytics-card .at-a-glance div .label {
        font-size: 0.8rem;
    }

    .session-analytics-card .at-a-glance div .data {
        font-size: 1.2rem;
        font-weight: 500;
    }

    .session-analytics-card .graph-area {
        flex: 1;
    }

    .session-analytics-card .graph-area .graph-content.to-be-implemented {
        width: 100%;
        height: 100%;
        background-color: #dedede;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.9rem;
        font-weight: 600;
        color: #7d7d7d;
    }
</style>
