import { IMatchFixture } from "@/components/common/api-football-response";
import { DateToolbox } from "@/components/common/toolbox/date";
import { Calendar, Clock, MapPin, User } from "lucide-react";

interface IMatchQuickInfoFixtureDetailsComponentProps {
    fixture: IMatchFixture;
    hasStarted: boolean;
}

export const MatchQuickInfoFixtureDetailsComponent = (props: IMatchQuickInfoFixtureDetailsComponentProps) => {
    const hasMatchDate = !!props.fixture.date;
    const matchDate = new Date(props.fixture.date);
    const matchDay = DateToolbox.getDayOfTheWeek(matchDate.getDay()).slice(0, 3);

    const hasMatchLocation = !!props.fixture.venue.name && !!props.fixture.venue.city;
    const matchLocation = `${props.fixture.venue.name}, ${props.fixture.venue.city.split(",")[0]}`;

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
