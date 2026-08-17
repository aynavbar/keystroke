<script>
    import { trapFocus } from "./lib/attachments.svelte";

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
    let endSession = $state(false);

    // recalculate the word count each time the document body changes
    let wordCount = $derived(doc.body.split(/ /).length)
    // create a separate copy of the document body to prevent race conditions while copying
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
      if (endSession) {
        copyToClipboard(clipboardDoc).finally(() => {
          doc.heading = ""
          doc.body = ""
          endSession = false // prevent `if` block rerun
        });
      }
    })
</script>

<main>
    <div class="content">
        <input bind:value={doc.heading} type="text" id="heading" placeholder="Type a heading">
        <textarea bind:value={doc.body} id="body" spellcheck="false" placeholder="Write something"></textarea>
    </div>
    <div class="fab">
        <button
            onclick={() => {
              showEndSessionDialog = true
            }}
            disabled={disableSessionEndButton}
        >
            <span class="material-symbols-rounded">
            stop
            </span>
            <span>
                End Session
            </span>
        </button>
    </div>
    {#if showEndSessionDialog}
        <div class="end-session-dialog-surface" {@attach trapFocus}>
            <div class="end-session-dialog-content">
                <h1 class="inter-700">End this session ?</h1>
                <p class="inter-500">{wordCount} words</p>
                <div class="actions-row">
                    <button onclick={() => {
                      showEndSessionDialog = false
                    }}>Keep writing</button>
                    <button onclick={() => {
                      endSession = true
                      showEndSessionDialog = false
                    }}>End session</button>
                </div>
            </div>
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
    }

    .fab button {
        border: none;
        color: #f70505;
        background-color: #ffd0d0;
    }

    .fab button:disabled {
        color: #ff7676;
        background-color: #f7e2e2;
    }

    .fab button span {
        background-color: transparent;
    }

    .fab button span:nth-child(1) {
        font-size: 20px;
    }

    .fab button span:nth-child(2) {
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 600;
    }

    .end-session-dialog-surface {
        position: fixed;
        background-color: #00000030;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
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

    .end-session-dialog-content .actions-row button:nth-child(2) {
        color: #ffffff;
        border: none;
        background-color: #1876ff;
    }
</style>
