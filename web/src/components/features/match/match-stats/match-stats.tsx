import { ApiFootballLogoComponent } from "@/components/common/api-football-logo/api-football-logo";
import { IMatchStat } from "@/components/common/api-football-response";
import { StringsToolbox } from "@/components/common/toolbox/strings";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "react-router-dom";

interface IMatchStatsComponentProps {
    stats: IMatchStat[];
}

interface IStatItem {
    type: string;
    homeTeamValue: string;
    awayTeamValue: string;
}

export const MatchStatsComponent = (props: IMatchStatsComponentProps) => {
    const stats: IStatItem[] = props.stats[0].statistics.map((homeTeamStat, idx) => {
        const awayTeamStat = props.stats[1].statistics[idx];
        return {
            type: homeTeamStat.type.replaceAll("_", " "),
            homeTeamValue: homeTeamStat.value ? (homeTeamStat.value as string) : "0",
            awayTeamValue: awayTeamStat.value ? (awayTeamStat.value as string) : "0",
        };
    });

    return (
        <>
            <h5 className="text-center text-3xl font-bold my-5">Match Stats</h5>
            <Separator />
            <section className="w-full p-3 flex justify-between">
                <NavLink
                    to={`/teams/id/${props.stats[0].team.id}`}
                    className="flex flex-1 justify-center items-center gap-2  font-bold hover:font-black focus:font-black"
                >
                    <ApiFootballLogoComponent
                        src={props.stats[0].team.logo}
                        alt={`${props.stats[0].team.name} logo`}
                        width={30}
                        height={30}
                    />
                    <h5 className="hidden sm:block text-lg">{props.stats[0].team.name}</h5>
                </NavLink>
                <section className="w-[175px]"></section>
                <NavLink
                    to={`/teams/id/${props.stats[1].team.id}`}
                    className="flex flex-1 justify-center items-center gap-2 font-bold hover:font-black focus:font-black"
                >
                    <h5 className="hidden sm:block text-lg">{props.stats[1].team.name}</h5>
                    <ApiFootballLogoComponent
                        src={props.stats[1].team.logo}
                        alt={`${props.stats[1].team.name} logo`}
                        width={30}
                        height={30}
                    />
                </NavLink>
            </section>
            <Separator />
            <section>
                {stats.map((stat, idx) => (
                    <section key={idx} className="odd:bg-muted">
                        <section className="flex justify-between items-center">
                            <section className="flex-1 flex justify-center text-center">{stat.homeTeamValue}</section>
                            <section className="w-[175px] text-center text-lg font-bold">
                                {StringsToolbox.PascalCase(stat.type)}
                            </section>
                            <section className="flex-1 flex justify-center text-center">{stat.awayTeamValue}</section>
                        </section>
                        <Separator />
                    </section>
                ))}
            </section>
        </>
    );
};
