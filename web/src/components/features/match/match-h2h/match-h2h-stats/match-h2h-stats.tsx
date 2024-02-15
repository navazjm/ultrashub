import { ApiFootballLogoComponent } from "@/components/common/api-football-logo/api-football-logo";
import { IMatch, IMatchTeam } from "@/components/common/api-football-response";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface IMatchH2HStatsComponentProps {
    matches: IMatch[];
    homeTeam: IMatchTeam;
    awayTeam: IMatchTeam;
}

export const MatchH2HStatsComponent = (props: IMatchH2HStatsComponentProps) => {
    const totalNumDraws = props.matches.filter((match) => !match.teams.home.winner && !match.teams.away.winner).length;

    // home team data
    const homeTeamWins = props.matches.filter((match) => {
        return (
            (match.teams.home.id === props.homeTeam.id && match.teams.home.winner) ||
            (match.teams.away.id === props.homeTeam.id && match.teams.away.winner)
        );
    });
    const totalNumHomeTeamWins = homeTeamWins.length;
    const numHomeTeamHomeWins = homeTeamWins.filter((match) => {
        return match.teams.home.id === props.homeTeam.id && match.teams.home.winner;
    }).length;
    const numHomeTeamAwayWins = homeTeamWins.filter((match) => {
        return match.teams.away.id === props.homeTeam.id && match.teams.away.winner;
    }).length;

    // away team data
    const awayTeamWins = props.matches.filter((match) => {
        return (
            (match.teams.home.id === props.awayTeam.id && match.teams.home.winner) ||
            (match.teams.away.id === props.awayTeam.id && match.teams.away.winner)
        );
    });
    const totalNumAwayTeamWins = awayTeamWins.length;
    const numAwayTeamHomeWins = awayTeamWins.filter((match) => {
        return match.teams.home.id === props.awayTeam.id && match.teams.home.winner;
    }).length;
    const numAwayTeamAwayWins = awayTeamWins.filter((match) => {
        return match.teams.away.id === props.awayTeam.id && match.teams.away.winner;
    }).length;

    // progress bars data
    const totalNumWins = totalNumHomeTeamWins + totalNumHomeTeamWins;
    const totalNumHomeWins = numHomeTeamHomeWins + numAwayTeamHomeWins;
    const totalNumAwayWins = numHomeTeamAwayWins + numAwayTeamAwayWins;
    const homeTeamWinRatio = (totalNumHomeTeamWins / totalNumWins) * 100;
    const homeTeamHomeWinsRatio = (numHomeTeamHomeWins / totalNumHomeWins) * 100;
    const homeTeamAwayWinsRatio = (numHomeTeamAwayWins / totalNumAwayWins) * 100;
    const awayTeamWinRatio = (totalNumAwayTeamWins / totalNumWins) * 100;
    const awayTeamHomeWinsRatio = (numAwayTeamHomeWins / totalNumHomeWins) * 100;
    const awayTeamAwayWinsRatio = (numAwayTeamAwayWins / totalNumAwayWins) * 100;

    return (
        <Card>
            <CardHeader className="flex flex-row justify-evenly items-center p-2 space-y-0">
                <section className="flex content-center gap-2">
                    <ApiFootballLogoComponent
                        src={props.homeTeam.logo}
                        alt={`${props.homeTeam.name} logo`}
                        width={25}
                        height={25}
                    />
                    <h5 className="text-lg font-bold hidden sm:block">{props.homeTeam.name}</h5>
                </section>
                <section className="flex content-center gap-2">
                    <h5 className="text-lg font-bold hidden sm:block">{props.awayTeam.name}</h5>
                    <ApiFootballLogoComponent
                        src={props.awayTeam.logo}
                        alt={`${props.awayTeam.name} logo`}
                        width={25}
                        height={25}
                    />
                </section>
            </CardHeader>
            <Separator className="my-2" />
            <CardContent className="flex justify-center items-center gap-5 md:gap-10 p-2 pt-0">
                <section className="md:w-80">
                    <section className="flex items-center gap-2">
                        <Progress value={homeTeamWinRatio} className="hidden md:block" />
                        <section className="flex justify-end gap-2">
                            <p className="w-[20px] font-black">{totalNumHomeTeamWins}</p>
                            <p className="w-[85px]">Total Wins</p>
                        </section>
                    </section>
                    <section className="flex items-center gap-2">
                        <Progress value={homeTeamHomeWinsRatio} className="hidden md:block" />
                        <section className="flex justify-end gap-2">
                            <p className="w-[20px] font-black">{numHomeTeamHomeWins}</p>
                            <p className="w-[85px] text-right">Home</p>
                        </section>
                    </section>
                    <section className="flex items-center gap-2">
                        <Progress value={homeTeamAwayWinsRatio} className="hidden md:block" />
                        <section className="flex justify-end gap-2">
                            <p className="w-[20px] font-black">{numHomeTeamAwayWins}</p>
                            <p className="w-[85px] text-right">Away</p>
                        </section>
                    </section>
                </section>
                <section className="flex flex-col items-center gap-2">
                    <small className="font-light">Played</small>
                    <h3 className="text-5xl font-black">{props.matches.length}</h3>
                    <small>
                        Draws <span className="font-black">{totalNumDraws}</span>
                    </small>
                </section>
                <section className="md:w-80">
                    <section className="flex items-center gap-2">
                        <section className="flex justify-start gap-2">
                            <p className="w-[85px]">Total Wins</p>
                            <p className="w-[20px] font-black">{totalNumAwayTeamWins}</p>
                        </section>
                        <Progress value={awayTeamWinRatio} className="hidden md:block" />
                    </section>
                    <section className="flex items-center gap-2">
                        <section className="flex justify-end gap-2">
                            <p className="w-[85px] text-left">Home</p>
                            <p className="w-[20px] font-black">{numAwayTeamHomeWins}</p>
                        </section>
                        <Progress value={awayTeamHomeWinsRatio} className="hidden md:block" />
                    </section>
                    <section className="flex items-center gap-2">
                        <section className="flex justify-end gap-2">
                            <p className="w-[85px] text-left">Away</p>
                            <p className="w-[20px] font-black">{numAwayTeamAwayWins}</p>
                        </section>
                        <Progress value={awayTeamAwayWinsRatio} className="hidden md:block" />
                    </section>
                </section>
            </CardContent>
        </Card>
    );
};
