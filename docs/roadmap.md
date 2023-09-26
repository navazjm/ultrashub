# UltrasHub - Roadmap 

### v0.1.0
- [x] cli tool to create json file from API Football api call to limit amount of api calls during development
    - API Football fixtures endpoint
- [x] "/" 
    - [x] returns all matches (both fixtures and results) for current date of access
    - [x] displays 7 day calendar to navigate between dates 
    - [x] displays top leagues/cups first
- [x] "/matches/date/YYYY-MM-DD"
    - [x] if given date == todays date, redirect to "/"
    - [x] returns all matches for given date.
    - [x] displays 7 day calendar to navigate between dates
    - [x] displays top leagues/cups first
- [x] "/matches/id/:id"
    - [x] returns a single match based on id
    - [x] if match is upcoming fixture:
        - displays details of upcoming fixture (date, time, etc) and teams head-to-head
    - [x] if match is finished 
        - displays results of match, match events, match stats, team lineups based.

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
    - "/matches/date/YYYY-MM-DD" 
- [ ] add links to "/clubs/id/:id" and "/leagues/id/:id" in the following routes:
    - "/"
    - "/matches/date/YYYY-MM-DD"
    - "/matches/id/:id"

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
    - "/matches/date/YYYY-MM-DD" 
    - "/transfers/latest" 
    - "/transfers/news" 
    - "/leagues/id/:id" 
- [ ] Add "favorite" button for leagues/cups
    - "/"
    - "/leagues"
    - "/leagues/id/:id"


### Needs more planning
- add quick links to nav (like tables and clubs for top leagues/cups)
