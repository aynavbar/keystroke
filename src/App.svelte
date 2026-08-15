<script>
    let doc = $state({
      heading: "This is a heading",
      body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim unde eos sed deserunt nobis quia dolorum magnam velit rerum rem, aspernatur consectetur aut officia dolores neque cumque minima ipsum reiciendis."
    })
</script>

<main>
    <header></header>
    <input bind:value={doc.heading} type="text" id="heading" placeholder="Type a heading">
    <textarea bind:value={doc.body} id="body" spellcheck="false" placeholder="Write something"></textarea>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    header {
        height: 60px;
    }

    input, textarea {
        padding-inline: clamp(5%, 2.5vw, 20%);
        padding-block: 10px;
        outline: none;
        border: none;
    }

    #heading {
        font-size: 3rem;
        font-weight: 700;
    }

    #body {
        flex: 1;
        font-size: 2rem;
    }
</style>
