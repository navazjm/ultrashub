# UltrasHub - Roadmap

|                | Legend           |
| -------------- | ---------------- |
| :sparkles:     | Released         |
| :construction: | Work in Progress |
| :x:            | Not implemented  |

### :sparkles: v0.1.0 - MVP using templates

- [x] cli tool to create json file from API Football api call to limit amount of api calls during development
  - API Football fixtures endpoint
- [x] "/"
  - [x] returns all matches (both fixtures and results) for current date of access
  - [x] displays 7 day calendar to navigate between dates
  - [x] displays top competitions/cups first
- [x] "/matches/date/YYYY-MM-DD"
  - [x] if given date == todays date, redirect to "/"
  - [x] returns all matches for given date.
  - [x] displays 7 day calendar to navigate between dates
  - [x] displays top competitions/cups first
- [x] "/matches/id/:id"
  - [x] returns a single match based on id
  - [x] if match is upcoming fixture:
    - displays details of upcoming fixture (date, time, etc) and teams head-to-head
  - [x] if match is finished
    - displays results of match, match events, match stats, team lineups based.

### :sparkles: v0.1.1 - Bug Fixes

- [x] correct current date for "/"
  - at 9pm EST on 10/07, loads current date as 10/08
- [x] text turnacate for long team names throughout the app
- [x] remove team names in H2H for "/matches/id/:id" on small devices
- [x] remove league IDs
- [x] add empty message for tabs in "/"
- [x] see why matches on saturday 10/07 are displaying substitutions wrong
  - player off and player in are swapped.
  - only for 10/07. any date before 10/07 works as intended

### :construction: v0.2.0 - Migrate to REST API & SPA

- [x] Convert webapp to REST API
- [x] convert web from templates to react app
- [ ] make any additional UI/UX changes to existing functionality
  - [x] added way to filter matches by competitions and teams for "/matches/data/YYYY-MM-DD"
  - [x] added show scores toggle to hide/show scores when selected date is the current match date for "/matches/data/YYYY-MM-DD"
  - [x] added a date picker instead of showing a range of dates around the selected date for "/matches/data/YYYY-MM-DD"
  - [x] matches are shown in the order of top competitions, world competitions, and rest of the world compeititons for "/matches/data/YYYY-MM-DD"
  - [x] added "important" match events (goals, red cards, VAR) to the quick info section for "/match/id/:id"
  - [x] added more info for each match event for "/match/id/:id" events tab
  - [x] merged second yellow card events into a red card event for "/match/id/:id" events tab
    - so instead of displaying a yellow card and a red card event back to back, we now display it as a single red card event with its event detail explaining it is the player's second yellow card.
  - [x] added player events for "/match/id/:id" lineups tab
  - [x] added new total h2h stats for "/match/id/:id" head-to-head tab
  - [x] changed from displaying 10 recent matches to 5 recent matches for "/match/id/:id" head-to-head tab
  - [x] added links to footer for contact, support, and policies (terms, security, & privacy)

### :x: v0.3.0 - Introduce competitions and clubs endpoints

- [ ] add competitions nav link option
  - should be a dropdown lists thats lists top competitions (leagues/cups)
  - should have an option to view all competitions
- [ ] "/competitions"
  - returns list of competitions to navigate to "/competitions/id/:id"
- [ ] "/competitions/id/:id"
  - returns matches, table, stats(show details like top goal scorer, assists??), clubs (links to "/clubs/id/:id"), and transfers for the specific league
- [ ] "/clubs/id/:id"
  - returns matches, league table with club highlighted, roster (show details like goals and assists??), transfers
- [ ] add filter by league to the following routes:
  - "/"
  - "/matches/date/YYYY-MM-DD"
- [ ] add links to "/clubs/id/:id" and "/competitions/id/:id" in the following routes:
  - "/"
  - "/matches/date/YYYY-MM-DD"
  - "/matches/id/:id"

### :x: v0.4.0 - Introduced User Authentication and Preferences/Settings

- [ ] "/users/new" -> create a new user account
- [ ] "/users/login" -> authenticate user
- [ ] "/users/logout" -> delete user session
- [ ] "/users/settings" -> user can CRUD settings like name, email, password?, etc...
- [ ] "/users/preferences"
  - user can CRUD app preferences
    - favorite clubs
    - favorite competitions (leagues/cups)
    - enable/disable hide results on "/"
    - enable/disable hide scores on "/" and "/matches/fixtures/date/YYYY-MM-DD"
- [ ] highlight users favorite teams/league/cups for the following routes:
  - "/"
  - "/matches/date/YYYY-MM-DD"
  - "/transfers/latest"
  - "/transfers/news"
  - "/competitions/id/:id"
- [ ] Add "favorite" button for competitions/cups
  - "/"
  - "/competitions"
  - "/competitions/id/:id"

### Needs more planning

- add quick links to nav (like tables and clubs for top competitions/cups)
