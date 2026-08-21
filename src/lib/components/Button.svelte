<script lang="ts">
    import type { Snippet } from "svelte";
    import type { EventHandler } from "svelte/elements";

    interface ButtonProps {
      className: string
      children: Snippet
      disabled: boolean
      onclick: EventHandler
      variant: "default" | "outlined" | "destructive"
    }

    let { className, children, disabled, onclick, variant = "default" }: ButtonProps = $props();
</script>

<button
    class="{className} {variant}"
    disabled={disabled}
    onclick={onclick}
>
    {@render children()}
</button>

<style>
    button {
        display: flex;
        align-items: center;
        padding-inline: 0.5rem;
        padding-block: 0.3rem;
        border-radius: 0.5rem;
        cursor: pointer;
        font-family: "Inter", sans-serif;
        border: none;
    }

    button.default {
        color: #ffffff;
        background-color: #1876ff;
    }

    button.outlined {
        border: 1px solid #9f9f9f;
        background-color: transparent;
    }

    button.destructive {
        color: #f70505;
        background-color: #ffd0d0;

        &:disabled {
            color: #ff7676;
            background-color: #f7e2e2;
        }
    }
</style>
