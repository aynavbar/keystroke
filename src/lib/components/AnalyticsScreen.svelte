<script>
    import { trapFocus } from "../attachments.svelte";

    import { sessionEndState, sessionTypingState } from "../store.svelte";

    import Button from "./Button.svelte";

    let formattedMinutes = $derived(
      `${sessionTypingState.startTime?.getMinutes() < 10 ? `0${sessionTypingState.startTime?.getMinutes()}`: sessionTypingState.startTime?.getMinutes()}`
    ) // 00 formatting for minutes

    let svgWidth = 700;
    let svgHeight = 200;

    // max values for scaling
    let maxTime = $derived(
      Math.max(
        sessionTypingState.timeInMinutes * 60,
        ...sessionTypingState.wpmHistory.map(d => d.t),
        ...sessionTypingState.backspaceHistory,
        1
      )
    );
    let maxWPM = $derived(
      Math.max(
        ...sessionTypingState.wpmHistory.map(d => d.wpm),
        10
      )
    );

    let polylinePoints = $derived(
      sessionTypingState.wpmHistory.map(d => {
        let x = (d.t / maxTime) * svgWidth;
        let y = svgHeight - (d.wpm / maxWPM) * svgHeight;
        return `${x},${y}`;
      }).join(" ")
    );
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
            <div class="graph-content">
                <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                    <!-- Grid line for base (wpm = 0) -->
                    <line x1="0" y1={svgHeight} x2={svgWidth} y2={svgHeight} stroke="#cecece" stroke-width="2" />

                    <!-- WPM Line Graph -->
                    {#if sessionTypingState.wpmHistory.length > 0}
                        <polyline
                            points={polylinePoints}
                            fill="none"
                            stroke="#007BFF"
                            stroke-width="2"
                        />
                    {/if}

                    <!-- Backspaces represented as points on the x-axis -->
                    {#each sessionTypingState.backspaceHistory as t}
                        <circle
                            cx={(t / maxTime) * svgWidth}
                            cy={svgHeight}
                            r="4"
                            fill="#FF0000"
                        />
                    {/each}
                </svg>
            </div>
        </div>
    </div>
    <Button
        onclick={() => {
          sessionEndState.showSessionAnalytics = false;
          sessionTypingState.startTime = null // reset the timer and await timer start trigger
          sessionTypingState.averageWPM = 0
          sessionTypingState.eraseCount = 0
          sessionTypingState.wpmHistory = []
          sessionTypingState.backspaceHistory = []
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
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .session-analytics-card .graph-area .graph-content {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
