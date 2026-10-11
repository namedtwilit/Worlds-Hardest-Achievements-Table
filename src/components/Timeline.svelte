<script>
  import { score, formatDate } from '../lib/score.js'

  let { data, ranked, onjump } = $props()
  let mode = $state('world')

  const scored = data.map((a) => ({ ...a, score: score(a) }))
  const rankNow = Object.fromEntries(ranked.map((a) => [a.id, a.rank]))
  const thisYear = new Date().getFullYear()
  const firstYear = Math.min(...data.map((a) => +a.date.slice(0, 4)))
  const addedDates = [...new Set(data.map((a) => a.added))].sort()

  let year = $state(thisYear)
  let step = $state(addedDates.length - 1)

  function upTo(a) {
    return mode === 'world' ? +a.date.slice(0, 4) <= year : a.added <= addedDates[step]
  }

  function isNew(a) {
    return mode === 'world' ? +a.date.slice(0, 4) === year : a.added === addedDates[step]
  }

  function victorsBy(a) {
    const listed = a.victors ?? []
    if (mode !== 'world') return Math.max(a.victorCount ?? 0, listed.length)
    if (year >= thisYear) return Math.max(a.victorCount ?? 0, listed.length)
    return listed.filter((v) => +v.date.slice(0, 4) <= year).length
  }

  let rows = $derived(
    scored
      .filter(upTo)
      .sort((x, y) => y.score - x.score)
      .map((a, i) => ({ ...a, at: i + 1, fresh: isNew(a), victorsThen: victorsBy(a) }))
  )

  let freshCount = $derived(rows.filter((r) => r.fresh).length)
  let label = $derived(mode === 'world' ? String(year) : formatDate(addedDates[step]))
</script>

<div class="timeline">
  <div class="modes">
    <button class:on={mode === 'world'} onclick={() => (mode = 'world')}>Real history</button>
    <button class:on={mode === 'history'} onclick={() => (mode = 'history')}>List history</button>
  </div>

  <div class="scrub">
    <div class="now">
      <span class="label">{label}</span>
      <span class="sub">
        {rows.length} {rows.length === 1 ? 'achievement' : 'achievements'}
        {#if freshCount}, {freshCount} new{/if}
      </span>
    </div>

    {#if mode === 'world'}
      <input type="range" min={firstYear} max={thisYear} bind:value={year} aria-label="Year" />
      <div class="ends"><span>{firstYear}</span><span>{thisYear}</span></div>
    {:else if addedDates.length > 1}
      <input type="range" min="0" max={addedDates.length - 1} bind:value={step} aria-label="Update" />
      <div class="ends"><span>{formatDate(addedDates[0])}</span><span>{formatDate(addedDates.at(-1))}</span></div>
    {:else}
      <p class="sub">Everything so far was added on {formatDate(addedDates[0])}. This fills up as the list grows.</p>
    {/if}
  </div>

  {#if rows.length === 0}
    <p class="empty">Nothing on the list had happened yet.</p>
  {:else}
    <ol class="rows">
      {#each rows as r (r.id)}
        <li class:fresh={r.fresh}>
          <button onclick={() => onjump(r.id)}>
            <span class="at">#{r.at}</span>
            <span class="what">
              <span class="title">{r.name}</span>
              <span class="who">{r.by.join(', ')}, {formatDate(r.date)}</span>
            </span>
            <span class="side">
              {#if r.fresh}<span class="new">New</span>{/if}
              {#if r.victorsThen}<span>{r.victorsThen.toLocaleString()} {r.victorsThen === 1 ? 'victor' : 'victors'}</span>{/if}
              {#if rankNow[r.id] !== r.at}<span>#{rankNow[r.id]} now</span>{/if}
            </span>
          </button>
        </li>
      {/each}
    </ol>
  {/if}
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

  .scrub {
    position: sticky;
    top: 68px;
    z-index: 5;
    margin: 16px 0 18px;
    padding: 16px 18px 12px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }

  .now {
    display: flex;
    align-items: baseline;
    gap: 14px;
    flex-wrap: wrap;
  }

  .label {
    font-family: var(--mono);
    font-size: 28px;
    color: var(--accent);
    line-height: 1.1;
  }

  .sub {
    font-size: 14px;
    color: var(--muted);
  }

  input[type='range'] {
    width: 100%;
    margin: 14px 0 4px;
    accent-color: var(--accent);
    cursor: pointer;
  }

  .ends {
    display: flex;
    justify-content: space-between;
    font-family: var(--mono);
    font-size: 12px;
    color: var(--muted);
  }

  .empty {
    color: var(--muted);
  }

  .rows {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .rows li + li {
    margin-top: 6px;
  }

  .rows button {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    padding: 10px 14px;
    text-align: left;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }

  .rows button:hover {
    border-color: var(--muted);
  }

  .fresh button {
    border-left: 3px solid var(--accent);
  }

  .at {
    width: 40px;
    flex-shrink: 0;
    font-family: var(--mono);
    font-size: 13px;
    color: var(--muted);
  }

  .what {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
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

  .new {
    color: var(--accent);
  }

  @media (max-width: 860px) {
    .scrub {
      top: 63px;
    }
  }
</style>
