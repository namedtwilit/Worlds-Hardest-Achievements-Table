<script>
  import { score, formatDate } from '../lib/score.js'

  let { data, ranked, onjump } = $props()
  let mode = $state('history')

  const rankOf = Object.fromEntries(ranked.map((a) => [a.id, a.rank]))

  let worldEvents = $derived.by(() => {
    const out = []
    for (const a of ranked) {
      out.push({ date: a.date, id: a.id, kind: 'done', title: a.name, who: a.by.join(', '), rank: a.rank })
      for (const v of a.victors ?? []) {
        out.push({ date: v.date, id: a.id, kind: 'victor', title: a.name, who: v.name, rank: a.rank })
      }
    }
    return out.sort((x, y) => x.date.localeCompare(y.date))
  })

  let listEvents = $derived.by(() => {
    const order = [...data].sort((x, y) => x.added.localeCompare(y.added) || x.date.localeCompare(y.date))
    const out = []
    const seen = []
    for (const a of order) {
      const s = score(a)
      const placed = seen.filter((x) => x > s).length + 1
      seen.push(s)
      out.push({ date: a.added, id: a.id, kind: 'added', title: a.name, who: a.by.join(', '), placed, rank: rankOf[a.id] })
    }
    return out.reverse()
  })

  let events = $derived(mode === 'world' ? worldEvents : listEvents)

  let groups = $derived.by(() => {
    const out = []
    for (const e of events) {
      const key = mode === 'world' ? e.date.slice(0, 4) : formatDate(e.date)
      if (!out.length || out.at(-1).key !== key) out.push({ key, year: +e.date.slice(0, 4), items: [] })
      out.at(-1).items.push(e)
    }
    return out
  })

  function gap(i) {
    if (mode !== 'world' || i === 0) return 0
    return groups[i].year - groups[i - 1].year
  }
</script>

<div class="timeline">
  <div class="modes">
    <button class:on={mode === 'history'} onclick={() => (mode = 'history')}>List history</button>
    <button class:on={mode === 'world'} onclick={() => (mode = 'world')}>Real history</button>
  </div>

  <p class="intro">
    {#if mode === 'world'}
      Everything on the list in the order it actually happened, from {groups[0]?.key} until now. Victors show up when they repeated it.
    {:else}
      Every change to the list, newest first.
    {/if}
  </p>

  {#each groups as g, i (g.key)}
    {#if gap(i) >= 5}
      <p class="gap">{gap(i)} years later</p>
    {/if}
    <section class="group">
      <h2>{g.key}</h2>
      <ol>
        {#each g.items as e}
          <li class={e.kind}>
            <button onclick={() => onjump(e.id)}>
              <span class="what">
                {#if e.kind === 'victor'}
                  <span class="label">Victor</span>
                {:else if e.kind === 'added'}
                  <span class="label">Added at #{e.placed}</span>
                {/if}
                <span class="title">{e.title}</span>
                <span class="who">{e.who}</span>
              </span>
              <span class="side">
                {#if mode === 'world'}<span class="date">{formatDate(e.date)}</span>{/if}
                <span class="rank">#{e.rank}</span>
              </span>
            </button>
          </li>
        {/each}
      </ol>
    </section>
  {/each}
</div>

<style>
  .timeline {
    max-width: 820px;
  }

  .modes {
    display: inline-flex;
    padding: 3px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }

  .modes button {
    padding: 6px 14px;
    font-size: 14px;
    background: none;
    border: none;
    border-radius: 6px;
    color: var(--muted);
  }

  .modes button.on {
    background: var(--surface-2);
    color: var(--text);
  }

  .intro {
    margin: 14px 0 24px;
    color: var(--muted);
    font-size: 14px;
  }

  .gap {
    margin: 0 0 18px 96px;
    padding-left: 18px;
    font-size: 12px;
    color: var(--muted);
    border-left: 1px dashed var(--border);
    line-height: 2.5;
  }

  .group {
    display: grid;
    grid-template-columns: 96px 1fr;
    margin-bottom: 18px;
  }

  h2 {
    margin: 0;
    padding-top: 10px;
    font-family: var(--mono);
    font-size: 15px;
    font-weight: 500;
    color: var(--accent);
  }

  ol {
    margin: 0;
    padding: 0 0 0 18px;
    list-style: none;
    border-left: 1px solid var(--border);
  }

  li + li {
    margin-top: 8px;
  }

  li button {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    width: 100%;
    padding: 10px 14px;
    text-align: left;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }

  li button::before {
    content: '';
    position: absolute;
    left: -24px;
    top: 50%;
    width: 9px;
    height: 9px;
    margin-top: -5px;
    background: var(--bg);
    border: 1px solid var(--muted);
    border-radius: 50%;
  }

  li.done button::before,
  li.added button::before {
    background: var(--accent);
    border-color: var(--accent);
  }

  li button:hover {
    border-color: var(--muted);
  }

  .what {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .label {
    font-size: 11px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .title {
    font-weight: 500;
  }

  .who {
    font-size: 13px;
    color: var(--muted);
  }

  .side {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex-shrink: 0;
    font-family: var(--mono);
    font-size: 12px;
    color: var(--muted);
  }

  @media (max-width: 640px) {
    .group {
      grid-template-columns: 1fr;
    }

    h2 {
      padding: 0 0 8px;
    }

    .gap {
      margin-left: 0;
    }
  }
</style>
