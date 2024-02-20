import { ApiFootballLogoComponent } from "@/components/common/api-football-logo/api-football-logo";
import { IStandingsByTeam } from "@/components/common/api-football-response";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NavLink } from "react-router-dom";

interface ICompetitionStandingsTableProps {
    standings: IStandingsByTeam[];
}

export const CompetitionStandingsTable = (props: ICompetitionStandingsTableProps) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="font-bold p-1 w-[35px] lg:w-auto">Pos</TableHead>
                    <TableHead className="font-bold p-1 w-[50px] md:w-[200px]">Club</TableHead>
                    <TableHead className="font-bold p-1 w-[35px] lg:w-auto">Pts</TableHead>
                    <TableHead className="font-bold p-1 w-[35px] lg:w-auto">Pl</TableHead>
                    <TableHead className="font-bold p-1 w-[35px] lg:w-auto">W</TableHead>
                    <TableHead className="font-bold p-1 w-[35px] lg:w-auto">D</TableHead>
                    <TableHead className="font-bold p-1 w-[35px] lg:w-auto">L</TableHead>
                    <TableHead className="font-bold p-1 w-[35px] lg:w-auto hidden sm:table-cell">GF</TableHead>
                    <TableHead className="font-bold p-1 w-[35px] lg:w-auto hidden sm:table-cell">GA</TableHead>
                    <TableHead className="font-bold p-1 w-[35px] lg:w-auto hidden sm:table-cell">GD</TableHead>
                    <TableHead className="font-bold p-1 hidden xl:table-cell">Form</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {props.standings.map((club, idx) => (
                    <TableRow
                        key={club.team.id}
                        className={`${
                            idx != props.standings.length - 1 &&
                            club.description != props.standings[idx + 1].description &&
                            "border-b-4"
                        }`}
                    >
                        <TableCell className="p-1">{club.rank}</TableCell>
                        <TableCell className="p-1">
                            <NavLink
                                to={`/clubs/id/${club.team.id}`}
                                className="flex items-center gap-2 hover:font-semibold focus:font-semibold"
                            >
                                <ApiFootballLogoComponent
                                    src={club.team.logo}
                                    alt={`${club.team.name} logo`}
                                    width={30}
                                    height={30}
                                />
                                <p className="hidden md:block">{club.team.name}</p>
                            </NavLink>
                        </TableCell>
                        <TableCell className="p-1 font-black">{club.points}</TableCell>
                        <TableCell className="p-1">{club.all.played}</TableCell>
                        <TableCell className="p-1">{club.all.win}</TableCell>
                        <TableCell className="p-1">{club.all.draw}</TableCell>
                        <TableCell className="p-1">{club.all.lose}</TableCell>
                        <TableCell className="p-1 hidden sm:table-cell">{club.all.goals.for}</TableCell>
                        <TableCell className="p-1 hidden sm:table-cell">{club.all.goals.against}</TableCell>
                        <TableCell className="p-1 hidden sm:table-cell">
                            {club.all.goals.for - club.all.goals.against}
                        </TableCell>
                        <TableCell className="p-1 hidden xl:table-cell">
                            <section className="flex items-center gap-2">
                                {club.form.split("").map((char, idx) => (
                                    <section key={`${char}-${idx}`}>
                                        <p
                                            className={`w-[25px] p-1 text-xs rounded-full text-center
                                                    ${char === "W" && "bg-green-700"} 
                                                    ${char === "L" && "bg-red-700"}
                                                    ${char === "D" && "bg-slate-700"}`}
                                        >
                                            {char}
                                        </p>
                                    </section>
                                ))}
                            </section>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
