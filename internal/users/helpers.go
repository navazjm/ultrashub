package users

import "github.com/navazjm/ultrashub/internal/validator"

func ValidateUserPreferences(v *validator.Validator, pref *UsersPreferences) {
	v.Check(pref.ShowScores == true || pref.ShowScores == false, "showScores", "ShowScores must be a boolean")
	v.Check(validator.IsNotBlank(pref.Timezone), "timezone", "Timezone is required")
	v.Check(validator.IsSliceSizeWithinLimit(pref.FavoriteTeams, 5), "favoriteTeams", "Favorite teams cannot exceed 5 teams")
	v.Check(validator.IsUnique(pref.FavoriteTeams), "favoriteTeams", "Favorite teams cannot contain duplicate teams")
	v.Check(validator.IsSliceSizeWithinLimit(pref.FavoriteCompetitions, 5), "favoriteCompetitions", "Favorite competitions cannot exceed 5 teams")
	v.Check(validator.IsUnique(pref.FavoriteCompetitions), "favoriteCompetitions", "Favorite competitions cannot contain duplicate teams")
}
