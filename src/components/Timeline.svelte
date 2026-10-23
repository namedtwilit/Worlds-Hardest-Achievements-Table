<script>
  import { score, byRank, formatDate } from '../lib/score.js'
  import { credit } from '../lib/names.js'
  import { toUnix, formatMoment, shift } from '../lib/time.js'

  let { data, ranked, onjump } = $props()
  let mode = $state('world')

  const scored = data.map((a) => ({
    ...a,
    score: score(a),
    at: toUnix(a.date),
    addedAt: toUnix(a.added),
    victorTimes: (a.victors ?? []).map((v) => toUnix(v.date))
  }))
  const rankNow = Object.fromEntries(ranked.map((a) => [a.id, a.rank]))
  const now = Math.floor(Date.now() / 1000)
  const year = 365 * 86400

  const worldEvents = [...new Set(scored.flatMap((a) => [a.at, ...a.victorTimes]))].sort((x, y) => x - y)
  const listEvents = [...new Set(scored.map((a) => a.addedAt))].sort((x, y) => x - y)

  let events = $derived(mode === 'world' ? worldEvents : listEvents)
  let min = $derived(events[0])
  let t = $state(now)
  let typed = $state('')

  const clamp = (v) => Math.min(now, Math.max(min, v))

  function setMode(m) {
    mode = m
    t = now
  }

  function nudge(unit, amount) {
    t = clamp(shift(t, unit, amount))
  }

  function prevEvent() {
    const e = events.findLast((x) => x < t)
    if (e !== undefined) t = e
  }

  function nextEvent() {
    const e = events.find((x) => x > t)
    t = e ?? now
  }

  function commitTyped() {
    const v = Number(typed.trim())
    if (typed.trim() !== '' && Number.isFinite(v)) t = clamp(Math.round(v))
    typed = ''
  }

  function happened(a) {
    return (mode === 'world' ? a.at : a.addedAt) <= t
  }

  function isNew(a) {
    const when = mode === 'world' ? a.at : a.addedAt
    return t - when < (mode === 'world' ? year : 86400)
  }

  function victorsBy(a) {
    const listed = a.victorTimes.filter((v) => v <= t).length
    if (mode !== 'world' || t >= now) return Math.max(a.victorCount ?? 0, a.victorTimes.length)
    return listed
  }

  let rows = $derived(
    scored
      .filter(happened)
      .sort(byRank)
      .map((a, i) => ({ ...a, place: i + 1, fresh: isNew(a), victorsThen: victorsBy(a) }))
  )

  let freshCount = $derived(rows.filter((r) => r.fresh).length)
  let moment = $derived(formatMoment(t))
  let span = $derived(formatMoment(min))
</script>

<div class="timeline">
  <div class="modes">
    <button class:on={mode === 'world'} onclick={() => setMode('world')}>Real history</button>
    <button class:on={mode === 'history'} onclick={() => setMode('history')}>List history</button>
  </div>

  <div class="scrub">
    <div class="now">
      <span class="label">{moment.date}</span>
      <span class="clock">{moment.time} UTC</span>
    </div>
    <div class="meta">
      <label class="unix">
        <span>Unix</span>
        <input
          type="text"
          inputmode="numeric"
          placeholder={String(t)}
          bind:value={typed}
          onchange={commitTyped}
          onkeydown={(e) => e.key === 'Enter' && commitTyped()}
        />
      </label>
      <span class="sub">
        {rows.length} {rows.length === 1 ? 'achievement' : 'achievements'}{#if freshCount}, {freshCount} new{mode === 'world' ? ' in the last year' : ' that day'}{/if}
      </span>
    </div>

    <input type="range" min={min} max={now} step="1" bind:value={t} aria-label="Moment in time" />
    <div class="ends"><span>{span.date}</span><span>Now</span></div>

    <div class="steps">
      <button onclick={prevEvent}>Prev</button>
      <span class="group">
        <button onclick={() => nudge('year', -1)}>-1y</button>
        <button onclick={() => nudge('day', -1)}>-1d</button>
        <button onclick={() => nudge('hour', -1)}>-1h</button>
        <button onclick={() => nudge('second', -1)}>-1s</button>
        <button onclick={() => nudge('second', 1)}>+1s</button>
        <button onclick={() => nudge('hour', 1)}>+1h</button>
        <button onclick={() => nudge('day', 1)}>+1d</button>
        <button onclick={() => nudge('year', 1)}>+1y</button>
      </span>
      <button onclick={nextEvent}>Next</button>
    </div>
  </div>

  {#if rows.length === 0}
    <p class="empty">Nothing on the list had happened yet.</p>
  {:else}
    <ol class="rows">
      {#each rows as r (r.id)}
        <li class:fresh={r.fresh}>
          <button onclick={() => onjump(r.id)}>
            <span class="at">#{r.place}</span>
            <span class="what">
              <span class="title">{r.name}</span>
              <span class="who">{credit(r)}, {formatDate(r.date)}</span>
            </span>
            <span class="side">
              {#if r.fresh}<span class="new">New</span>{/if}
              {#if r.victorsThen}<span>{r.victorsThen.toLocaleString()} {r.victorsThen === 1 ? 'victor' : 'victors'}</span>{/if}
              {#if rankNow[r.id] !== r.place}<span>#{rankNow[r.id]} now</span>{/if}
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

  .clock {
    font-family: var(--mono);
    font-size: 16px;
    color: var(--muted);
  }

  .meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 8px;
  }

  .unix {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .unix input {
    width: 150px;
    padding: 4px 8px;
    font-family: var(--mono);
    font-size: 13px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 6px;
  }

  .unix input:focus {
    outline: none;
    border-color: var(--accent);
  }

  .steps {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 12px;
  }

  .group {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .steps button {
    padding: 4px 9px;
    font-family: var(--mono);
    font-size: 12px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--muted);
  }

  .steps button:hover {
    color: var(--text);
    border-color: var(--muted);
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
