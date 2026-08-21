<script>
    import { slide, fade } from "svelte/transition";

    import { trapFocus } from "./lib/attachments.svelte";

    import Button from "./lib/components/Button.svelte";

    let doc = $state({
      heading: "Lorem Ipsum",
      body: `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean odio elit, eleifend at sem eget, sodales facilisis dui. Mauris pharetra id dolor vitae tempus. Etiam auctor libero nunc, eu tincidunt mi laoreet in. Cras ac augue nisi. Maecenas felis tellus, aliquam et hendrerit non, imperdiet vitae leo. Nunc eget nisl faucibus, vulputate nisi pharetra, porta neque. Nullam ultrices massa urna, a feugiat arcu tristique nec. Donec finibus ante arcu, eget accumsan tellus feugiat non. Aenean dolor metus, mattis vel diam a, feugiat viverra urna. Nunc luctus aliquet quam eget finibus. Mauris consequat massa id massa scelerisque congue vel et nunc. Etiam convallis dignissim mi, at interdum justo finibus eget. Phasellus porta sed lorem quis egestas. Quisque consequat aliquam neque.

      Sed a lectus tortor. Suspendisse vestibulum magna libero, a tristique tellus suscipit sed. Fusce facilisis enim quam, vel ornare tortor venenatis vitae. Quisque eu sem mattis, ullamcorper libero sit amet, porta nisi. Nulla porttitor mi viverra leo suscipit placerat. Sed vitae condimentum lorem, nec tempor mi. Fusce suscipit luctus magna et dignissim. Aenean efficitur scelerisque arcu, eu viverra nulla malesuada et. Nam tincidunt, lectus lobortis pulvinar tempor, orci dui efficitur leo, vitae egestas nibh metus laoreet erat.

      Fusce eleifend consectetur laoreet. Mauris vitae blandit velit, a luctus urna. Mauris nec enim id tellus dignissim laoreet. Sed vel turpis vitae ante vulputate cursus. Ut ullamcorper eros libero, ac interdum nisi venenatis in. Fusce bibendum in sem non imperdiet. Morbi pharetra pulvinar sapien, sit amet tempor neque vehicula sit amet. Maecenas ac enim odio.

      Sed enim metus, sollicitudin sed eleifend id, auctor quis ante. Sed luctus interdum velit, id aliquet ligula efficitur quis. Mauris vitae diam pulvinar, imperdiet justo ut, dictum elit. Cras porta fermentum sem, ut pellentesque eros iaculis rhoncus. Maecenas at consectetur orci. Morbi mollis enim non nulla molestie rhoncus. Nunc euismod metus non consectetur faucibus. Nulla posuere mattis nulla a laoreet. Aenean suscipit dolor quis lorem faucibus feugiat. Ut eros nisl, hendrerit a nisl eu, venenatis dictum magna. Nulla in rutrum ex, id porttitor nunc. Integer euismod eros ac ex pretium, pretium viverra neque tempus. Quisque iaculis bibendum lacus et volutpat.

      Curabitur sagittis ligula et enim auctor interdum. Nullam et cursus diam. Ut eget purus nisl. Nullam ut eleifend massa, ac vestibulum libero. Aliquam consectetur, odio non commodo dictum, lorem dui laoreet ex, non volutpat diam erat eget lacus. Morbi dignissim dui at pharetra gravida. Aenean quis efficitur ligula. Integer aliquet commodo diam eget porta. Ut luctus augue enim, eu tempor ligula facilisis eget. Suspendisse fermentum turpis ut felis elementum elementum. Quisque dolor lacus, ullamcorper vitae velit vitae, dapibus ultricies dui.
      `
    })

    let showEndSessionDialog = $state(false);
    let showCopyInfoToast = $state(false);
    let showSessionAnalytics = $state(false);
    let endSession = $state(false);
    let startTime = $state(null);
    let formattedMinutes = $derived(
      `${startTime.getMinutes() < 10 ? `0${startTime.getMinutes()}`: startTime.getMinutes()}`
    ) // 00 formatting for minutes
    let timeInMinutes = $state(0);
    let averageWPM = $state(0);
    let eraseCount = $state(0); // each time content was removed from the textarea

    // recalculate the word count each time the document body changes
    // standard tests treat every five characters, including spaces and punctuation, as one word
    let wordCount = $derived(doc.body.split(/\s+/).length)

    // create a separate copy of the document body to prevent race conditions while copying to clipboard
    let clipboardDoc = $derived(doc.body)

    // toggle the 'End session' button's `disabled` state by evaluating
    // whether there's an content in the document's body
    let disableSessionEndButton = $derived(doc.body ? false : true)

    async function copyToClipboard(text) {
      const type = "text/plain";
      const clipboardItemData = {
        [type]: text,
      }

      const clipboardItem = new ClipboardItem(clipboardItemData)
      await navigator.clipboard.write([clipboardItem]);
    }

    $effect(() => {
      // clear the document after a session is ended
      if (!endSession) return;
      endSession = false // prevent effect logic rerun during `then` callback run
      let toastTimeoutID;
      copyToClipboard(clipboardDoc)
        .finally(() => {
          doc.heading = ""
          doc.body = ""
          showCopyInfoToast = true
          toastTimeoutID = setTimeout(() => {
            showCopyInfoToast = false
          }, 2000) // set a 2 second delay to hide the the toast
        });

      return () => {
        clearTimeout(toastTimeoutID) // cleanup for the toast timeout
      }
    })

    $effect(() => {
      if (wordCount >= 5 && startTime === null) {
        startTime = new Date(); // take a timestamp of when the first 'word' was written
      } else if (wordCount >= 5) {
        averageWPM = (wordCount / 5) / timeInMinutes // using minutes for now since there isn't sampling logic to average out multiple wpm samples
      };
    })
</script>

<main>
    <div class="content">
        <input bind:value={doc.heading} type="text" id="heading" placeholder="Type a heading">
        <textarea
            bind:value={doc.body}
            id="body" spellcheck="false"
            placeholder="Write something"
            oninput={(event) => {
              if (event.inputType === "deleteContentBackward" || event.inputType === "deleteContentForward") {
                eraseCount += 1
              }
            }}
        ></textarea>
    </div>
    <div class="fab">
        <Button
            variant="destructive"
            onclick={() => {
              showEndSessionDialog = true
              let endTime = new Date();
              timeInMinutes = Math.floor(((endTime.getTime() - startTime.getTime()) / 1000) / 60); // minutes as whole numbers only
            }}
            disabled={disableSessionEndButton}
        >
            <span class="material-symbols-rounded">
            stop
            </span>
            <span class="inter-500">
                End Session
            </span>
        </Button>
    </div>
    {#if showEndSessionDialog}
        <div class="end-session-dialog-surface" {@attach trapFocus} transition:fade={{duration: 50}}>
            <div class="end-session-dialog-content">
                <h1 class="inter-700">End this session ?</h1>
                <p class="inter-500">{wordCount} words • {timeInMinutes} minute{timeInMinutes === 1 ? '' : 's'} • {averageWPM === Infinity ? 0 : averageWPM} wpm</p>
                <div class="actions-row">
                    <Button
                        variant="outlined"
                        onclick={() => {
                          showEndSessionDialog = false
                        }}
                    >Keep writing</Button>
                    <Button onclick={() => {
                      endSession = true
                      showEndSessionDialog = false
                      showSessionAnalytics = true
                    }}>End session</Button>
                </div>
            </div>
        </div>
    {/if}
    {#if showCopyInfoToast}
        <div class="copy-info-toast-container" transition:slide={{axis: "y"}}>
            <div class="copy-info">
                <p class="inter-400">Copied to clipboard!</p>
            </div>
        </div>
    {/if}
    {#if showSessionAnalytics}
        <div class="session-analytics-container" {@attach trapFocus}>
            <div class="session-analytics-card">
                <div class="heading">
                    <p>Today, {startTime ? startTime.getHours() : ''}:{startTime ? formattedMinutes: ''}</p>
                </div>
                <div class="at-a-glance">
                    <div>
                        <p class="label">Duration (minutes)</p>
                        <p class="data">{timeInMinutes}</p>
                    </div>
                    <div>
                        <p class="label">Average wpm</p>
                        <p class="data">{averageWPM === Infinity ? 0 : averageWPM}</p>
                    </div>
                    <div>
                        <p class="label">Backspaces</p>
                        <p class="data">{eraseCount}</p>
                    </div>
                </div>
                <div class="graph-area"></div>
            </div>
            <Button
                onclick={() => {
                  showSessionAnalytics = false;
                  startTime = null // reset the timer and await timer start trigger
                  averageWPM = 0
                  eraseCount = 0
                }}
            >
                Start new session
            </Button>
        </div>
    {/if}
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .content {
        display: flex;
        flex-direction: column;
        flex: 1;
        max-width: 50rem;
        width: 100%;
        margin: auto;
    }

    input, textarea {
        padding-block: 0.6rem;
        outline: none;
        border: none;
    }

    #heading {
        font-size: 1.7rem;
        font-weight: 700;
    }

    #body {
        flex: 1;
        font-size: 1.2rem;
        resize: none;
        width: 100%;
        scrollbar-width: none;
    }

    .fab {
        position: fixed;
        bottom: 1.2rem;
        right: 1.2rem;
        z-index: 9999;
        background-color: transparent;
    }

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

    .copy-info-toast-container {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 4rem;
        inset-inline: 0;
        background-color: #e2ffe2;
        display: flex;
        align-items: center;
        z-index: 999999;
    }

    .copy-info-toast-container .copy-info {
        color: green;
        height: fit-content;
        background-color: transparent;
        padding-inline-start: 2rem;
    }

    .copy-info p {
        background-color: transparent;
    }

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
</style>
