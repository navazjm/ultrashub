# UltrasHub - Roadmap 

### v0.1.0
- "/fixtures/date/YYYY-MM-DD" -> returns all fixtures for given date, display 7 day calendar to navigate between dates
- "/fixtures/id/:id" -> returns a single fixture based on id, display details of fixture based on its status

### v0.2.0 
- "/transfers" -> show latest transfers for all leagues/teams
- "/transfers/news" -> show latest transfer news for all leagues/teams

### v0.3.0
- "/leagues/" -> returns list of leagues to navigate to "/leagues/id/:id" 
- "/leagues/id/:id" -> returns matches, table, stats(show details like top goal scorer, assists??), clubs (links to "/clubs/id/:id"), and transfers for the specific league 
- "/clubs/id/:id" -> returns fixtures (upcoming and history), league table with team highlighted, roster (show details like goals and assists??), transfers

### v0.4.0
- "/users/new" -> create a new user account
- "/users/login" -> authenticate user 
- "/users/logout" -> delete user session 
- "/users/settings" -> user can CRUD settings like name, email, password?, etc...
- "/users/preferences" -> user can CRUD app preferences like favorite teams/leagues, etc...  
- "/fixtures/date/YYYY-MM-DD" -> update based on user preferences above

### Needs more planning
- "/" -> unknown for the time being
