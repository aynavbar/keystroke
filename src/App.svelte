<script>
    import { trapFocus } from "./lib/attachments.svelte";

    import { sessionEndState, sessionTypingState } from "./lib/store.svelte";

    import AnalyticsScreen from "./lib/components/AnalyticsScreen.svelte";
    import Button from "./lib/components/Button.svelte";
    import Dialog from "./lib/components/Dialog.svelte";
    import Toast from "./lib/components/Toast.svelte";

    let doc = $state({
      heading: "",
      body: ""
    })

    let showCopyInfoToast = $state(false);

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
      if (!sessionEndState.endSession) return;
      sessionEndState.endSession = false // prevent effect logic rerun during `then` callback run
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
      if (wordCount >= 5 && sessionTypingState.startTime === null) {
        sessionTypingState.startTime = new Date(); // take a timestamp of when the first 'word' was written
      } else if (wordCount >= 5) {
        sessionTypingState.averageWPM = (wordCount / 5) / sessionTypingState.timeInMinutes // using minutes for now since there isn't sampling logic to average out multiple wpm samples
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
                sessionTypingState.eraseCount += 1
              }
            }}
        ></textarea>
    </div>
    <div class="fab">
        <Button
            variant="destructive"
            onclick={() => {
              sessionEndState.showEndSessionDialog = true
              let endTime = new Date();
              sessionTypingState.timeInMinutes = Math.floor(((endTime.getTime() - sessionTypingState.startTime.getTime()) / 1000) / 60); // minutes as whole numbers only
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
    {#if sessionEndState.showEndSessionDialog}
        <Dialog
            sessionWordCount={wordCount}
            sessionTimeInMinutes={sessionTypingState.timeInMinutes}
            sessionAverageWPM={sessionTypingState.averageWPM}
        />
    {/if}
    {#if showCopyInfoToast}
        <Toast
            message="Copied to Clipboard!"
        />
    {/if}
    {#if sessionEndState.showSessionAnalytics}
        <AnalyticsScreen />
    {/if}
</main>

<style>
    main {
        display: none;
        flex-direction: column;
        height: 100vh;
    }

    @media (min-width: 672px) {
        main {
            display: flex;
        }
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
        padding-inline: 1rem;
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
</style>
