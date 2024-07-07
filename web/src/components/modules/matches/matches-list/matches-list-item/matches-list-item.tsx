import { NavLink } from "react-router-dom";
import { IProps } from "@/common/types";
import { IMatch } from "@/common/responses/api-football";
import { MatchToolbox } from "@/common/toolbox/match";
import { ApiFootballLogoComponent } from "@/components/shared/api-football-logo/api-football-logo";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/shadcn";
import { useAuthContext, useAxiosPrivate } from "@/common/auth/auth.hooks";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AxiosResponse } from "axios";
import { IUsersPreferencesResponse } from "@/common/auth/auth.types";
import { Spinner } from "@/components/ui/spinner";

interface IMatchesListItemComponentProps extends IProps {
    match: IMatch;
    showScores: boolean;
}
export const MatchesListItemComponent = (props: IMatchesListItemComponentProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [isTogglingHomeTeam, setIsTogglingHomeTeam] = useState<boolean>(false);
    const [isTogglingAwayTeam, setIsTogglingAwayTeam] = useState<boolean>(false);
    const authCtx = useAuthContext();
    const axiosPrivate = useAxiosPrivate();
    const { toast } = useToast();

    const displayMatchStatus: string = MatchToolbox.getDisplayMatchStatus(props.match.fixture);
    const matchInProgress: boolean = MatchToolbox.isMatchInProgress(props.match.fixture.status.short);
    const matchHasStarted: boolean = MatchToolbox.hasMatchStarted(props.match.fixture.status.short);

    let toggleHomeTeamFavoriteBtnText = `Add ${props.match.teams.home.name} to favorite teams`;
    const homeTeamUserFavoritesIdx = authCtx.usersPreferences.favoriteTeams.findIndex(
        (teamID) => teamID === props.match.teams.home.id,
    );
    if (homeTeamUserFavoritesIdx !== -1) {
        toggleHomeTeamFavoriteBtnText = `Remove ${props.match.teams.home.name} as a favorite team`;
    }

    let toggleAwayTeamFavoriteBtnText = `Add ${props.match.teams.away.name} to favorite teams`;
    const awayTeamUserFavoritesIdx = authCtx.usersPreferences.favoriteTeams.findIndex(
        (teamID) => teamID === props.match.teams.away.id,
    );
    if (awayTeamUserFavoritesIdx !== -1) {
        toggleAwayTeamFavoriteBtnText = `Remove ${props.match.teams.away.name} as a favorite team`;
    }

    const updateUserFavoriteTeams = async (
        evt: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        teamID: number,
        foundIndex: number,
        isHomeTeam: boolean,
    ) => {
        evt.stopPropagation();
        const userFavoriteTeams = [...authCtx.usersPreferences.favoriteTeams];
        if (foundIndex == -1) {
            if (authCtx.usersPreferences.favoriteTeams.length >= 5) {
                toast({
                    variant: "destructive",
                    title: "Error!",
                    description: "Cannot add more than 5 teams to favorites.",
                });

                setIsDropdownOpen(false);
                return;
            }

            userFavoriteTeams.push(teamID);
        } else {
            userFavoriteTeams.splice(foundIndex, 1);
        }

        isHomeTeam ? setIsTogglingHomeTeam(true) : setIsTogglingAwayTeam(true);

        try {
            const resp: AxiosResponse<IUsersPreferencesResponse> = await axiosPrivate.patch("/users/preferences", {
                favoriteTeams: userFavoriteTeams,
            });
            authCtx.setUsersPreferences(resp.data.data);
        } catch (err) {
            toast({ variant: "destructive", title: "Error!", description: "Failed to update user's favorite teams." });
        } finally {
            isHomeTeam ? setIsTogglingHomeTeam(false) : setIsTogglingAwayTeam(false);
            setIsDropdownOpen(false);
        }
    };

    return (
        <NavLink
            to={`/matches/id/${props.match.fixture.id}`}
            className={cn(
                "grid grid-cols-4 items-center w-full p-3 hover:bg-muted focus:bg-muted",
                MatchToolbox.hasFavoriteTeam(props.match, authCtx.usersPreferences.favoriteTeams) && "bg-favorite",
            )}
        >
            <section className="font-extralight">{displayMatchStatus}</section>
            <section className="flex items-center justify-between gap-3 p-0 col-span-3">
                <section
                    className={cn(
                        "flex items-center justify-end gap-2 flex-1",
                        props.showScores && !matchInProgress && props.match.teams.away.winner && "opacity-40",
                    )}
                >
                    <p className="hidden sm:block sm:text-xs md:text-sm lg:text-base">{props.match.teams.home.name}</p>
                    <ApiFootballLogoComponent
                        src={props.match.teams.home.logo}
                        alt={`${props.match.teams.home.name} logo`}
                        width={30}
                        height={30}
                    />
                </section>
                <section className="flex justify-center items-center gap-2 min-w-[45px]">
                    {props.showScores && (
                        <>
                            <section
                                className={cn(
                                    props.showScores &&
                                        !matchInProgress &&
                                        props.match.teams.away.winner &&
                                        "opacity-40",
                                )}
                            >
                                {props.match.goals.home}
                                {props.match.fixture.status.short === "PEN" && (
                                    <span className="ml-1">({props.match.score.penalty.home})</span>
                                )}
                            </section>
                            <section className={cn(props.showScores && !matchHasStarted && "hidden")}>-</section>
                            <section
                                className={cn(
                                    props.showScores &&
                                        !matchInProgress &&
                                        props.match.teams.home.winner &&
                                        "opacity-40",
                                )}
                            >
                                {props.match.goals.away}
                                {props.match.fixture.status.short === "PEN" && (
                                    <span className="ml-1">({props.match.score.penalty.away})</span>
                                )}
                            </section>
                        </>
                    )}
                </section>
                <section
                    className={cn(
                        "flex items-center justify-start gap-2 flex-1",
                        props.showScores && !matchInProgress && props.match.teams.home.winner && "opacity-40",
                    )}
                >
                    <ApiFootballLogoComponent
                        src={props.match.teams.away.logo}
                        alt={`${props.match.teams.away.name} logo`}
                        width={30}
                        height={30}
                    />
                    <p className="hidden sm:block sm:text-xs md:text-sm lg:text-base">{props.match.teams.away.name}</p>
                </section>
                <section className="w-[16px]">
                    {authCtx.firebaseUser && (
                        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="w-5 h-5 p-0">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-ellipsis-vertical"
                                    >
                                        <circle cx="12" cy="12" r="1" />
                                        <circle cx="12" cy="5" r="1" />
                                        <circle cx="12" cy="19" r="1" />
                                    </svg>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="p-0 w-[300px]">
                                <Button
                                    className="w-full"
                                    variant="ghost"
                                    onClick={(evt) =>
                                        updateUserFavoriteTeams(
                                            evt,
                                            props.match.teams.home.id,
                                            homeTeamUserFavoritesIdx,
                                            true,
                                        )
                                    }
                                    disabled={isTogglingHomeTeam || isTogglingAwayTeam}
                                >
                                    {isTogglingHomeTeam ? <Spinner /> : <>{toggleHomeTeamFavoriteBtnText}</>}
                                </Button>
                                <Button
                                    className="w-full"
                                    variant="ghost"
                                    onClick={(evt) =>
                                        updateUserFavoriteTeams(
                                            evt,
                                            props.match.teams.away.id,
                                            awayTeamUserFavoritesIdx,
                                            false,
                                        )
                                    }
                                    disabled={isTogglingHomeTeam || isTogglingAwayTeam}
                                >
                                    {isTogglingAwayTeam ? <Spinner /> : <>{toggleAwayTeamFavoriteBtnText}</>}
                                </Button>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </section>
            </section>
        </NavLink>
    );
};
