export class UsersToolbox {
    /**
     * Returns the initials of a user's name
     * @param name ex: "Michael Navarro"
     * @return ex: "MN"
     */
    public static getInitialsFromName(name: string): string {
        const names = name.split(" ");

        let currInitials = names[0][0].toUpperCase();
        if (names.length === 1) {
            return currInitials;
        }

        currInitials += names[names.length - 1][0].toUpperCase();
        return currInitials;
    }
}
