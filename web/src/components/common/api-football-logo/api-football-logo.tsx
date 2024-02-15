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
            className={`object-cover ${props.width ? `w-[${props.width}px]` : "w-auto"} ${
                props.height ? `h-[${props.height}px]` : "h-auto"
            }`}
            style={{
                aspectRatio: aspectRatio ? aspectRatio.toString() : undefined,
            }}
        />
    );
};
