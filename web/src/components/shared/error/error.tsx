interface IErrorComponentProps {
    title?: string;
    message?: string;
}

export const ErrorComponent = (props: IErrorComponentProps) => {
    const title = props.title ? props.title : "Error!"
    const message = props.message
        ? props.message
        : "Uh oh! Encountered an error. Please try again later.";

    return (
        <>
            <h3 className="font-bold">{title}</h3>
            <section className="my-3">
                <p>{message}</p>
            </section>
        </>
    );
};
