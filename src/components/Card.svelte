<script>
  import { tags } from '../lib/tags.js'
  import { othersText } from '../lib/names.js'
  import { formatDate, formatOdds, describeGrind, describeStakes, stakesWeight, maxScore } from '../lib/score.js'

  let { a } = $props()
  let open = $state(false)

  let medal = $derived(['gold', 'silver', 'bronze'][a.rank - 1] ?? '')
  let victors = $derived([...(a.victors ?? [])].sort((x, y) => x.date.localeCompare(y.date)))
  let victorTotal = $derived(Math.max(a.victorCount ?? 0, victors.length))

  const tagOrder = Object.keys(tags)
  const place = (t) => (tagOrder.includes(t) ? tagOrder.indexOf(t) : tagOrder.length)
  let sortedTags = $derived([...a.tags].sort((x, y) => place(x) - place(y)))

  function joinNames(names) {
    if (names.length <= 2) return names.join(' and ')
    return `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`
  }

  let rest = $derived(othersText(a.others))
  let lead = $derived(rest ? a.by.join(', ') : joinNames(a.by))

  function onKey(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      open = !open
    }
  }
</script>

<article class="card" class:has-image={a.image} class:open id={a.id}>
  <div class="body" role="button" tabindex="0" aria-expanded={open} onclick={() => (open = !open)} onkeydown={onKey}>
    <span class="rank {medal}">#{a.rank}</span>
    <h3>{a.name}</h3>
    <p class="by">by <span>{lead}</span>{#if rest} and {rest}{/if} <span class="country">{a.country}</span></p>

    <dl class="stats">
      <div><dt>Date</dt><dd>{formatDate(a.date)}</dd></div>
      <div><dt>Where</dt><dd>{a.where}</dd></div>
      <div><dt>Victors</dt><dd>{victorTotal.toLocaleString()}</dd></div>
    </dl>

    <dl class="scores">
      <div class="total"><dt>Score</dt><dd>{a.score}<span>/{maxScore}</span></dd></div>
      <div><dt>Luck</dt><dd>{a.parts.luck}</dd></div>
      <div><dt>Grind</dt><dd>{a.parts.grind}</dd></div>
      <div><dt>Ceiling</dt><dd>{a.parts.ceiling}</dd></div>
      <div><dt>Stakes</dt><dd>{a.parts.stakes}</dd></div>
    </dl>

    <div class="foot">
      <ul class="tags">
        {#each sortedTags as t}
          <li title={tags[t]?.info}>{tags[t]?.label ?? t}</li>
        {/each}
      </ul>
      <span class="more">{open ? 'Less' : 'More'}</span>
    </div>
  </div>

  {#if a.image}
    <img src={a.image} alt="" loading="lazy" />
  {/if}

  {#if open}
    <div class="details">
      {#if a.note}
        <p class="note">{a.note}</p>
      {/if}

      <h4>Why this score</h4>
      <ul class="why">
        <li><span>Luck {a.parts.luck}</span>{formatOdds(a.odds)} on the run that counted</li>
        <li><span>Grind {a.parts.grind}</span>{describeGrind(a.parts.grind)} from zero</li>
        <li><span>Ceiling {a.parts.ceiling}</span>{a.ceiling < 10 ? 'almost anyone has the body for it' : `${formatOdds(a.ceiling)} people have the body for it`}</li>
        <li><span>Stakes {a.parts.stakes}</span>failing means {describeStakes(a.parts.stakes)}, counts {stakesWeight === 0.5 ? 'half' : `x${stakesWeight}`}</li>
      </ul>

      <h4>Victors</h4>
      {#if victors.length}
        <ol class="victors">
          {#each victors as v, i}
            <li>
              <span class="num">{i + 1}</span>
              <span class="who">{v.name}</span>
              {#if v.note}<span class="vnote">{v.note}</span>{/if}
              <span class="when">{formatDate(v.date)}</span>
            </li>
          {/each}
        </ol>
      {/if}
      {#if victorTotal > victors.length}
        <p class="empty">{victors.length ? 'Plus' : 'About'} {(victorTotal - victors.length).toLocaleString()} {victors.length ? 'more' : 'people'} not listed yet.</p>
      {:else if !victors.length}
        <p class="empty">Nobody has done it again yet.</p>
      {/if}
    </div>
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

  .card.open {
    border-color: #3a3e45;
  }

  .body {
    padding: 18px 22px;
    min-width: 0;
    cursor: pointer;
  }

  .body:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: -2px;
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

  .scores {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 22px;
    margin: 10px 0 0;
  }

  .scores dt {
    font-size: 11px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .scores dd {
    margin: 0;
    font-family: var(--mono);
    font-size: 14px;
  }

  .scores .total dd {
    color: var(--accent);
  }

  .scores .total span {
    color: var(--muted);
    font-size: 12px;
  }

  .why {
    margin: 0 0 16px;
    padding: 0;
    list-style: none;
    font-size: 14px;
  }

  .why li {
    padding: 3px 0;
  }

  .why span {
    display: inline-block;
    width: 92px;
    font-family: var(--mono);
    font-size: 12px;
    color: var(--muted);
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
  }

  .more {
    flex-shrink: 0;
    font-size: 12px;
    color: var(--muted);
  }

  .body:hover .more {
    color: var(--text);
  }

  .details {
    grid-column: 1 / -1;
    padding: 16px 22px 20px;
    background: var(--surface-2);
    border-top: 1px solid var(--border);
  }

  .note {
    margin: 0 0 14px;
    font-size: 14px;
  }

  h4 {
    margin: 0 0 8px;
    font-size: 11px;
    font-weight: 500;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .victors {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .victors li {
    display: flex;
    align-items: baseline;
    gap: 12px;
    padding: 7px 0;
    font-size: 14px;
    border-bottom: 1px solid var(--border);
  }

  .victors li:last-child {
    border-bottom: none;
  }

  .num {
    width: 22px;
    font-family: var(--mono);
    font-size: 12px;
    color: var(--muted);
  }

  .who {
    flex: 1;
    min-width: 0;
  }

  .vnote {
    font-size: 12px;
    color: var(--muted);
  }

  .when {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--muted);
    white-space: nowrap;
  }

  .empty {
    margin: 4px 0 0;
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

    .body,
    .details {
      padding-left: 16px;
      padding-right: 16px;
    }

    .vnote {
      display: none;
    }
  }
</style>
