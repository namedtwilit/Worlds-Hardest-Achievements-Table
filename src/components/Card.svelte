<script>
  import { tags } from '../lib/tags.js'
  import { formatDate, formatGrind, formatGate } from '../lib/score.js'

  let { a } = $props()
  let noteOpen = $state(false)

  let medal = $derived(['gold', 'silver', 'bronze'][a.rank - 1] ?? '')

  function joinNames(names) {
    if (names.length <= 2) return names.join(' and ')
    return `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`
  }
</script>

<article class="card" class:has-image={a.image}>
  <div class="body">
    <span class="rank {medal}">#{a.rank}</span>
    <h3>{a.name}</h3>
    <p class="by">by <span>{joinNames(a.by)}</span> <span class="country">{a.country}</span></p>

    <dl class="stats">
      <div><dt>Date</dt><dd>{formatDate(a.date)}</dd></div>
      <div><dt>Where</dt><dd>{a.where}</dd></div>
      <div><dt>Luck</dt><dd>{a.luck} flips</dd></div>
      <div><dt>Grind</dt><dd>{formatGrind(a.grind)}</dd></div>
      <div><dt>Gate</dt><dd>{formatGate(a.gate)}</dd></div>
      {#if a.victors}
        <div><dt>Victors</dt><dd>{a.victors}</dd></div>
      {/if}
    </dl>

    <div class="foot">
      <ul class="tags">
        {#each a.tags as t}
          <li title={tags[t]?.info}>{tags[t]?.label ?? t}</li>
        {/each}
      </ul>
      {#if a.note}
        <button class="note-btn" onclick={() => (noteOpen = !noteOpen)}>Note</button>
      {/if}
    </div>

    {#if noteOpen}
      <p class="note">{a.note}</p>
    {/if}
  </div>

  {#if a.image}
    <img src={a.image} alt="" loading="lazy" />
  {/if}
</article>

<style>
  .card {
    display: grid;
    grid-template-columns: 1fr;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
  }

  .card.has-image {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
  }

  .body {
    padding: 18px 22px;
    min-width: 0;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .rank {
    display: inline-block;
    font-family: var(--mono);
    font-size: 13px;
    color: var(--muted);
  }

  .rank.gold,
  .rank.silver,
  .rank.bronze {
    padding: 1px 8px;
    border: 1px solid currentColor;
    border-radius: 999px;
  }

  .rank.gold {
    color: var(--accent);
  }

  .rank.silver {
    color: var(--silver);
  }

  .rank.bronze {
    color: var(--bronze);
  }

  h3 {
    margin: 4px 0 0;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.3;
  }

  .by {
    margin: 2px 0 0;
    font-size: 14px;
    color: var(--muted);
  }

  .by span:first-child {
    color: var(--accent);
  }

  .country {
    margin-left: 4px;
    font-family: var(--mono);
    font-size: 12px;
  }

  .stats {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 22px;
    margin: 14px 0 0;
    padding-top: 12px;
    border-top: 1px solid var(--border);
  }

  .stats dt {
    font-size: 11px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .stats dd {
    margin: 0;
    font-size: 14px;
  }

  .foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 14px;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .tags li {
    padding: 2px 9px;
    font-size: 12px;
    color: var(--muted);
    background: var(--surface-2);
    border-radius: 4px;
    cursor: default;
  }

  .note-btn {
    flex-shrink: 0;
    padding: 3px 10px;
    font-size: 12px;
    background: none;
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--muted);
  }

  .note-btn:hover {
    color: var(--text);
  }

  .note {
    margin: 10px 0 0;
    font-size: 14px;
    color: var(--muted);
  }

  @media (max-width: 640px) {
    .card.has-image {
      grid-template-columns: 1fr;
    }

    img {
      order: -1;
      height: 140px;
    }

    .body {
      padding: 16px;
    }
  }
</style>
