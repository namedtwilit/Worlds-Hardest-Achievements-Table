# W.H.A.T

Worlds Hardest Achievements Table. A ranked list of the hardest things humans have ever done.

## How entries are ranked

Every achievement gets four scores from 1 to 10. Decimals are fine.

**Luck**: the odds of the run that counted. Only count serious runs, the ones that got far enough to actually threaten a win, like runs past 50% in a GD level. Deaths in the first few seconds of a quick retry don't count, or feats with fast retries would look way luckier than they are. You put in the odds as `odds` (436000 means 1 in 436,000) and the site turns it into a score. Every extra zero is +1:

| Odds | Luck |
|---|---|
| no luck needed | 1 |
| 1 in 10 | 2 |
| 1 in 1,000 | 4 |
| 1 in 1 million | 7 |
| 1 in 1 billion | 10 |

**Grind**: how long a dedicated person starting from zero would need, including training and failed tries.

| Time | Grind |
|---|---|
| a day | 1 |
| a week | 2 |
| a month | 3 |
| 6 months | 4 |
| a year | 5 |
| 3 years | 6 |
| 5 years | 7 |
| 10 years | 8 |
| 20 years | 9 |
| a lifetime | 10 |

**Ceiling**: how many people are physically able to do what the feat needs at all, like the inputs, speed, strength or stamina. Not how many could get good enough, and not how many are trying right now. You put in "1 in how many people" as `ceiling` and it works like Luck, every extra zero is +1. 1 means almost anyone has the body for it, 1e9 means maybe nobody else alive does.

For example, Grief has a ceiling of 1.3. Its inputs are hard, but most people's hands could physically do them, so almost all of its difficulty is in Grind and Luck instead.

**Stakes**: what a failed attempt costs you.

| Failing means | Stakes |
|---|---|
| retry in seconds | 1 |
| lose minutes of progress | 3 |
| lose hours, or a big mental hit | 4 |
| lose months, or a lot of money | 6 |
| serious injury | 8 |
| you probably die | 10 |

In-between values are fine. A 5 sits between losing hours and losing months, a 9 is between serious injury and probably dying, and so on.

The score is Luck + Grind + Ceiling + half of Stakes, out of 35. Stakes counts half so danger matters without taking over the whole list.

Ranks 1 to 1000 are the Main List, 1001 to 2000 are the Extended List, and everything after is the Legacy List.

Only firsts and records get their own entry. People who repeat a feat later count as victors.

## Adding an entry

Add an object to `src/data/achievements.json`:

```json
{
  "id": "short-unique-id",
  "name": "What was done",
  "by": ["Person or group"],
  "country": "US",
  "date": "1969-07-20",
  "where": "Place",
  "odds": 2,
  "grind": 8,
  "ceiling": 1e4,
  "stakes": 10,
  "tags": ["first", "team"],
  "added": "2026-10-10"
}
```

`added` is the day the entry went on the list. The timeline uses it for the list history.

Optional fields:

- `others`: everyone in the group who isn't named in `by`. A number shows as "and 8 others", text shows as written, like `"crew"` for "and crew". Keep `by` for real names only.
- `victors`: people who did it after, like `[{ "name": "John Landy", "date": "1954-06-21" }]`. Each one can also have a `note`.
- `victorCount`: total victors when there are too many to list, like Everest.
- `note`, `image`, and `adjust` (added to the score to nudge a placement).

## Running locally

```
npm install
npm run dev
```
