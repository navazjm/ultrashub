import { MatchFixture } from "@/components/common/api-football-response";
import { getDayOfTheWeek } from "@/components/common/date";
import { Calendar, Clock, MapPin, User } from "lucide-react";

interface IMatchQuickInfoFixtureDetailsComponentProps {
    fixture: MatchFixture;
    hasStarted: boolean;
}

export const MatchQuickInfoFixtureDetailsComponent = (props: IMatchQuickInfoFixtureDetailsComponentProps) => {
    const hasMatchDate = !!props.fixture.date;
    const matchDate = new Date(props.fixture.date);
    const matchDay = getDayOfTheWeek(matchDate.getDay()).slice(0, 3);

    const hasMatchLocation = !!props.fixture.venue.name && !!props.fixture.venue.city;
    const matchLocation = `${props.fixture.venue.name}, ${props.fixture.venue.city}`;

    const hasReferee = !!props.fixture.referee;

    return (
        <>
            {props.hasStarted && hasMatchDate && (
                <>
                    <section className="flex items-center gap-2">
                        <Calendar className="w-[20px]" />
                        <p>
                            {matchDay} {matchDate.toLocaleDateString()}
                        </p>
                    </section>
                    <section className="flex items-center gap-2">
                        <Clock className="w-[20px]" />
                        <p>Kick Off: {matchDate.toLocaleTimeString()}</p>
                    </section>
                </>
            )}

            {hasMatchLocation && (
                <section className="flex items-center gap-2">
                    <MapPin className="w-[20px]" />
                    <p>{matchLocation}</p>
                </section>
            )}

            {hasReferee && (
                <section className="flex items-center gap-2">
                    <User className="w-[20px]" />
                    <p>Ref: {props.fixture.referee}</p>
                </section>
            )}
        </>
    );
};
