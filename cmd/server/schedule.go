package main

import "net/http"

func (app *application) getFixturesForCurrentDate(w http.ResponseWriter, r *http.Request) {
	data := app.newTemplateData(r)
	app.render(w, http.StatusOK, "fixtures.html", data)
}
