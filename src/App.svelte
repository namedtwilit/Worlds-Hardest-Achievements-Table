<script>
  import data from './data/achievements.json'
  import { rankAll, sectionOf } from './lib/score.js'
  import Card from './components/Card.svelte'
  import Panel from './components/Panel.svelte'

  const ranked = rankAll(data)

  let query = $state('')
  let sortBy = $state('rank')
  let ascending = $state(true)
  let active = $state([])
  let panelOpen = $state(false)

  const sorters = {
    rank: (a, b) => a.rank - b.rank,
    date: (a, b) => a.date.localeCompare(b.date),
    name: (a, b) => a.name.localeCompare(b.name),
    luck: (a, b) => a.luck - b.luck,
    grind: (a, b) => a.grind - b.grind,
    gate: (a, b) => a.gate - b.gate
  }

  let shown = $derived.by(() => {
    const q = query.trim().toLowerCase()
    const list = ranked.filter((a) => {
      if (active.some((t) => !a.tags.includes(t))) return false
      if (!q) return true
      return (
        a.name.toLowerCase().includes(q) ||
        a.by.some((p) => p.toLowerCase().includes(q)) ||
        a.where.toLowerCase().includes(q)
      )
    })
    list.sort(sorters[sortBy])
    if (!ascending) list.reverse()
    return list
  })

  let grouped = $derived(sortBy === 'rank' && ascending)
</script>

<header>
  <div class="brand">
    <span class="logo">W.H.A.T</span>
    <span class="full">Worlds Hardest Achievements Table</span>
  </div>
  <input class="search" type="search" placeholder="Search by name, person or place" bind:value={query} />
  <button class="panel-toggle" onclick={() => (panelOpen = !panelOpen)}>
    {panelOpen ? 'Hide filters' : 'Filters'}
  </button>
</header>

<div class="layout">
  <main>
    {#if shown.length === 0}
      <p class="empty">Nothing matches that.</p>
    {/if}
    {#each shown as a, i (a.id)}
      {#if grouped && (i === 0 || sectionOf(a.rank) !== sectionOf(shown[i - 1].rank))}
        <h2 class="section">{sectionOf(a.rank).name}</h2>
      {/if}
      <Card {a} />
    {/each}
  </main>

  <aside class:open={panelOpen}>
    <Panel bind:sortBy bind:ascending bind:active total={ranked.length} count={shown.length} />
  </aside>
</div>

<style>
  header {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px 24px;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
  }

  .brand {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
    flex-shrink: 0;
  }

  .logo {
    font-family: var(--mono);
    font-size: 20px;
    color: var(--accent);
    letter-spacing: 1px;
  }

  .full {
    font-size: 12px;
    color: var(--muted);
  }

  .search {
    flex: 1;
    max-width: 520px;
    padding: 9px 14px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }

  .search:focus {
    outline: none;
    border-color: var(--accent);
  }

  .panel-toggle {
    display: none;
    padding: 9px 14px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }

  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 300px;
    gap: 24px;
    max-width: 1280px;
    margin: 0 auto;
    padding: 24px;
  }

  main {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .section {
    margin: 12px 0 0;
    font-size: 14px;
    font-weight: 500;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .section:first-child {
    margin-top: 0;
  }

  .empty {
    color: var(--muted);
  }

  aside {
    position: sticky;
    top: 92px;
    align-self: start;
  }

  @media (max-width: 860px) {
    header {
      flex-wrap: wrap;
      padding: 12px 16px;
    }

    .search {
      order: 3;
      max-width: none;
      flex-basis: 100%;
    }

    .panel-toggle {
      display: block;
      margin-left: auto;
    }

    .layout {
      grid-template-columns: 1fr;
      padding: 16px;
    }

    aside {
      position: static;
      display: none;
      order: -1;
    }

    aside.open {
      display: block;
    }
  }
</style>
