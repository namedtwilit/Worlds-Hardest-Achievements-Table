# W.H.A.T

Worlds Hardest Achievements Table. A ranked list of the hardest things humans have ever done.

## How entries are ranked

Every achievement gets three numbers:

- **Luck**: the odds of one perfect attempt, written as coin flips in a row. 10 flips means about 1 in 1,000.
- **Grind**: how many years a dedicated person starting from zero would need, including training and failed tries.
- **Gate**: how many people could ever do it. 1e6 means about 1 in a million people.

The site combines them into a score and sorts by it. Ranks 1 to 1000 are the Main List, 1001 to 2000 are the Extended List, and everything after is the Legacy List.

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
  "luck": 5,
  "grind": 8,
  "gate": 1e9,
  "tags": ["first", "team"],
  "added": "2026-10-10"
}
```

`added` is the day the entry went on the list. The timeline uses it for the list history.

Optional fields:

- `victors`: people who did it after, like `[{ "name": "John Landy", "date": "1954-06-21" }]`. Each one can also have a `note`.
- `victorCount`: total victors when there are too many to list, like Everest.
- `note`, `image`, and `adjust` (added to the score to nudge a placement).

## Running locally

```
npm install
npm run dev
```
