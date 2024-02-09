import { BackNavigationComponent } from "../back-navigation/back-navigation";

interface IErrorComponentProps {
    backNavTitle?: string;
    errorMessage?: string;
}

export const ErrorComponent = (props: IErrorComponentProps) => {
    const errorMessage = !!props.errorMessage
        ? props.errorMessage
        : "Uh oh! Encountered an error. Please try again later.";
    // determine if previous page was from ultrashub origin
    const isPreviousPageFromUH = document.referrer.includes(window.location.origin);

    if (!isPreviousPageFromUH) {
        return <h3>{errorMessage}</h3>;
    }

    return (
        <>
            <BackNavigationComponent title={props.backNavTitle} />
            <section className="my-3">
                <p>{errorMessage}</p>
            </section>
        </>
    );
};
