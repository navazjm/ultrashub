interface IApiFootballLogoComponentProps {
    alt: string;
    src: string;
    width?: number;
    height?: number;
}

export const ApiFootballLogoComponent = (props: IApiFootballLogoComponentProps) => {
    const aspectRatio = props.width && props.height ? props.width / props.height : undefined;
    return (
        <img
            src={props.src}
            alt={props.alt}
            loading="lazy"
            className="object-scale-down"
            style={{
                aspectRatio: aspectRatio ? aspectRatio.toString() : undefined,
                width: props.width ? `${props.width}px` : "auto",
                height: props.height ? `${props.height}px` : "auto",
            }}
        />
    );
};
