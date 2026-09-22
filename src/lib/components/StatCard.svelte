<script lang="ts">
    interface StarCardProps {
        label: string
        data: string | number
    }

    let { label, data }: StarCardProps = $props();
</script>

<div class="stat-card">
    <p class="data {label === 'Times deleted' && 'text-red'}">{data}</p>
    <p class="label">{label}</p>
</div>

<style>
    .stat-card {
        flex: 1;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 5px;
        border: var(--border);
        border-width: 2px;
        border-radius: 15px;
    }

    .data {
        font-size: 1.5rem;
        font-weight: 800;
    }

    .data.text-red {
        color: #ff3434;
    }

    .label {
        font-size: 0.6rem;
        font-weight: 600;
        color: var(--secondary-text);
    }
</style>