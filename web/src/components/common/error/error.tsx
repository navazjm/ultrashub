interface IErrorComponentProps {
    message?: string;
}

export const ErrorComponent = (props: IErrorComponentProps) => {
    if (props.message !== "") {
        return <h3>Uh oh! Encountered an error. Please try again later.</h3>;
    }

    return <h3>{props.message}</h3>;
};
