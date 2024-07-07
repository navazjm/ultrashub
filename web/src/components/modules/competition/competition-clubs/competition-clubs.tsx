import { NavLink } from "react-router-dom";
import { IStandingTeamInfo } from "@/common/responses/api-football";
import { Card, CardContent } from "@/components/ui/card";
import { ApiFootballLogoComponent } from "@/components/shared/api-football-logo/api-football-logo";
import { MoveRight } from "lucide-react";
import { cn } from "@/lib/shadcn";
import { useAuthContext } from "@/common/auth/auth.hooks";

interface ICompetitionClubsComponentProps {
    clubs: IStandingTeamInfo[];
}

export const CompetitionClubsComponent = (props: ICompetitionClubsComponentProps) => {
    const authCtx = useAuthContext();
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
            {props.clubs.map((club) => (
                <NavLink key={club.id} to={`/teams/id/${club.id}`}>
                    <Card
                        className={cn(
                            "w-full p-3 hover:bg-muted focus:bg-muted",
                            authCtx.usersPreferences.favoriteTeams.includes(club.id) && "bg-favorite",
                        )}
                    >
                        <CardContent className="p-2 flex justify-between items-center">
                            <section className="flex items-center gap-2">
                                <ApiFootballLogoComponent
                                    src={club.logo}
                                    alt={`${club.name} logo`}
                                    width={40}
                                    height={40}
                                />
                                <h3 className="font-bold text-lg">{club.name}</h3>
                            </section>
                            <MoveRight className="h-4 w-4 opacity-40" />
                        </CardContent>
                    </Card>
                </NavLink>
            ))}
        </section>
    );
};
