<script>
  import { tags } from '../lib/tags.js'

  let { sortBy = $bindable(), ascending = $bindable(), active = $bindable(), total, count } = $props()

  const sortOptions = [
    ['rank', 'Rank'],
    ['date', 'Date'],
    ['name', 'Name'],
    ['luck', 'Luck'],
    ['grind', 'Grind'],
    ['ceiling', 'Ceiling'],
    ['stakes', 'Stakes']
  ]

  function toggle(t) {
    active = active.includes(t) ? active.filter((x) => x !== t) : [...active, t]
  }
</script>

<div class="panel">
  <section>
    <h4>Sort</h4>
    <div class="row">
      <select bind:value={sortBy}>
        {#each sortOptions as [value, label]}
          <option {value}>{label}</option>
        {/each}
      </select>
      <select bind:value={ascending}>
        <option value={true}>Ascending</option>
        <option value={false}>Descending</option>
      </select>
    </div>
  </section>

  <section>
    <div class="head">
      <h4>Filter</h4>
      {#if active.length}
        <button class="reset" onclick={() => (active = [])}>Reset</button>
      {/if}
    </div>
    <div class="grid">
      {#each Object.entries(tags) as [key, t]}
        <button class="tag" class:on={active.includes(key)} title={t.info} onclick={() => toggle(key)}>
          {t.label}
        </button>
      {/each}
    </div>
  </section>

  <p class="count">Showing {count} of {total}</p>
</div>

<style>
  .panel {
    padding: 18px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }

  section + section {
    margin-top: 20px;
    padding-top: 18px;
    border-top: 1px solid var(--border);
  }

  h4 {
    margin: 0 0 10px;
    font-size: 12px;
    font-weight: 500;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .reset {
    padding: 0;
    font-size: 12px;
    background: none;
    border: none;
    color: var(--accent);
  }

  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  select {
    width: 100%;
    padding: 7px 10px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 6px;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }

  .tag {
    padding: 7px 10px;
    font-size: 13px;
    text-align: left;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 6px;
  }

  .tag:hover {
    border-color: var(--muted);
  }

  .tag.on {
    color: var(--accent);
    border-color: var(--accent);
  }

  .count {
    margin: 18px 0 0;
    font-size: 13px;
    color: var(--muted);
  }
</style>
