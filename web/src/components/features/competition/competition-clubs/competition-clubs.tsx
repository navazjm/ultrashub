import { NavLink } from "react-router-dom";
import { IStandingTeamInfo } from "@/components/common/api-football-response";
import { Card, CardContent } from "@/components/ui/card";
import { ApiFootballLogoComponent } from "@/components/common/api-football-logo/api-football-logo";
import { MoveRight } from "lucide-react";

interface ICompetitionClubsComponentProps {
    clubs: IStandingTeamInfo[];
}

export const CompetitionClubsComponent = (props: ICompetitionClubsComponentProps) => {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
            {props.clubs.map((club) => (
                <NavLink key={club.id} to={`/club/id/${club.id}`}>
                    <Card className="w-full p-3 hover:bg-muted focus:bg-muted">
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
