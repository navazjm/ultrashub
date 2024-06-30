export interface IUsersPreferences {
    uid: string;
    showScores: boolean;
    favoriteTeams: number[];
    favoriteCompetitions: number[];
    timezone: string;
    createdAt: Date;
    updatedAt: Date;
    version: number;
}

export interface IUsersPreferencesResponse {
    data: IUsersPreferences;
}

export const DefaultUserPreferences: IUsersPreferences = {
    uid: "",
    showScores: false,
    favoriteTeams: [],
    favoriteCompetitions: [],
    timezone: "America/Chicago",
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 0,
};
