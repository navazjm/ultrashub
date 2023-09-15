# UltrasHub - Roadmap 

### v0.1.0
- [ ] cli tool to create json file from API Football api call to limit amount of api calls during development
    - API Football fixtures endpoint
- [ ] "/" 
    - returns all matches (both fixtures and results) for current date of access, display 7 day calendar to navigate between dates, display top leagues/cups first
- [ ] "/matches/fixtures/date/YYYY-MM-DD"
    - returns not started or in-play fixtures for given date, display 7 day calendar to navigate between dates, display top leagues/cups first. If date is in the past of current date, navigate to "/matches/results/YYYY-MM-DD"
- [ ] "/matches/fixtures/id/:id"
    - returns a single fixture based on id, display details of upcoming fixture and teams head-to-head. If match already finished, navigate to "/matches/results/id/:id"
- [ ] "/matches/results/date/YYYY-MM-DD"
    - returns finished fixtures for given date, display 7 day calendar to navigate between dates, display top leagues/cups first. If date is in the future of current date, navigate to "/matches/fixtures/YYYY-MM-DD"
- [ ] "/matches/results/id/:id"
    - returns a single finished fixture based on id, display results of match, match events, match stats, team lineups based. If match has not finished, navigate to "/matches/fixtures/id/:id"

### v0.2.0 
- [ ] cli tool -> API Football transfers endpoint 
- [ ] "/transfers/latest"
    - show latest transfers for all leagues/teams
- [ ] "/transfers/news"
    - show latest transfer news for all leagues/teams

### v0.3.0
- [ ] cli tool -> API Football leagues endpoint 
- [ ] cli tool -> API Football teams endpoint
- [ ] "/leagues" 
    - returns list of leagues to navigate to "/leagues/id/:id" 
- [ ] "/leagues/id/:id" 
    - returns matches, table, stats(show details like top goal scorer, assists??), clubs (links to "/clubs/id/:id"), and transfers for the specific league 
- [ ] "/clubs/id/:id" 
    - returns matches, league table with club highlighted, roster (show details like goals and assists??), transfers
- [ ] add filter by league to the following routes:
    - "/"
    - "/matches/fixtures/date/YYYY-MM-DD"
    - "/matches/results/date/YYYY-MM-DD" 
- [ ] add links to "/clubs/id/:id" and "/leagues/id/:id" in the following routes:
    - "/"
    - "/matches/fixtures/date/YYYY-MM-DD"
    - "/matches/fixtures/id/:id"
    - "/matches/results/id/:id"

### v0.4.0
- [ ] "/users/new" -> create a new user account
- [ ] "/users/login" -> authenticate user 
- [ ] "/users/logout" -> delete user session 
- [ ] "/users/settings" -> user can CRUD settings like name, email, password?, etc...
- [ ] "/users/preferences"
    - user can CRUD app preferences
        - favorite clubs
        - favorite leagues/cups
        - enable/disable hide results on "/"
        - enable/disable hide scores on "/" and "/matches/fixtures/date/YYYY-MM-DD"
- [ ] highlight users favorite teams/league/cups for the following routes:
    - "/" 
    - "/matches/fixtures/date/YYYY-MM-DD" 
    - "/matches/results/date/YYYY-MM-DD" 
    - "/transfers/latest" 
    - "/transfers/news" 
    - "/leagues/id/:id" 
- [ ] Add "favorite" button for leagues/cups
    - "/"
    - "/leagues"
    - "/leagues/id/:id"


### Needs more planning
- add quick links to nav (like tables and clubs for top leagues/cups)
