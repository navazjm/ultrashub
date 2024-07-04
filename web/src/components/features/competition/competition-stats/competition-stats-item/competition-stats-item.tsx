import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiFootballLogoComponent } from "@/components/common/api-football-logo/api-football-logo";
import { Separator } from "@/components/ui/separator";
import { IPlayerStats } from "@/components/common/responses/api-football";

type IPlayerStatsType = "goals" | "assists" | "yellowcards" | "redcards";

interface ICompetitionStatsItemComponentProps {
    type: IPlayerStatsType;
    stats: IPlayerStats[];
}

export const CompetitionStatsItemComponent = (props: ICompetitionStatsItemComponentProps) => {
    let title = "";
    switch (props.type) {
        case "goals":
            title = "Top Goal Scorer";
            break;
        case "assists":
            title = "Most Assists";
            break;
        case "yellowcards":
            title = "Most Yellow Cards";
            break;
        case "redcards":
            title = "Most Red Cards";
            break;
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent>
                {props.stats.map((player, idx) => (
                    <section key={player.player.id} className="flex items-center justify-between p-2 mb-2">
                        <section className="flex justify-start items-center gap-8">
                            <small>{idx + 1}</small>
                            <section className="flex items-center gap-2">
                                <ApiFootballLogoComponent
                                    src={player.player.photo}
                                    alt={`${player.player.name} headshot`}
                                    width={30}
                                />
                                <section className="flex flex-col">
                                    <p>{player.player.name}</p>
                                    <small className="font-extralight">{player.statistics[0].team.name}</small>
                                </section>
                            </section>
                        </section>
                        <section>
                            <p className="font-black">
                                {props.type === "goals" && player.statistics[0].goals.total}
                                {props.type === "assists" && player.statistics[0].goals.assists}
                                {props.type === "yellowcards" && player.statistics[0].cards.yellow}
                                {props.type === "redcards" &&
                                    player.statistics[0].cards.red + player.statistics[0].cards.yellowred}
                            </p>
                        </section>
                    </section>
                ))}
            </CardContent>
        </Card>
    );
};
