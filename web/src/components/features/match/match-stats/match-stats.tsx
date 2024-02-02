import { MatchStat } from "@/components/common/api-football-response";
import { StringsToolbox } from "@/components/common/toolbox/strings";
import { Separator } from "@/components/ui/separator";

interface IMatchStatsComponentProps {
    stats: MatchStat[];
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
                <section className="flex flex-1 justify-center items-center">
                    <img
                        src={props.stats[0].team.logo}
                        alt=""
                        loading="lazy"
                        className="w-[30px] h-[30px] mr-2 object-scale-down"
                    />
                    <h5 className="hidden sm:block text-lg font-bold">{props.stats[0].team.name}</h5>
                </section>
                <section className="w-[175px]"></section>
                <section className="flex flex-1 justify-center items-center">
                    <h5 className="hidden sm:block text-lg font-bold">{props.stats[1].team.name}</h5>
                    <img
                        src={props.stats[1].team.logo}
                        alt=""
                        loading="lazy"
                        className="w-[30px] h-[30px] ml-2 object-scale-down"
                    />
                </section>
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
