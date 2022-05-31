import { ReactNode } from "react";
import styles from "./MyButton.module.scss";

type MyButtonBaseProps = {
    className?: Object;
    onClick?: Function;
    stretch?: boolean;
    moreRounded?: boolean;
    disabled?: boolean;
    adButton?: boolean;
} & ({ small?: false; noPadding?: true } | { small?: true; noPadding?: false }) &
    ({ submit?: never; children: ReactNode } | { submit?: true; children: string }) &
    (
        | {
              primary?: true;
              secondary?: never;
          }
        | {
              primary?: never;
              secondary?: true;
          }
    );

const MyButton = ({
    className = null,
    children,
    onClick = null,
    primary,
    secondary,
    stretch,
    small,
    noPadding,
    moreRounded,
    submit,
    adButton = false,
    disabled = false,
}: MyButtonBaseProps) => {
    const classNameResult = `${className} ${styles.button} ${stretch && styles.stretch} ${primary && styles.primary}  ${
        secondary && styles.secondary
    } ${small && styles.small} ${noPadding && styles.noPadding} ${moreRounded && styles.moreRounded} ${adButton && styles.adButton}`;

    const onButtonClick = (event) => {
        if (onClick) {
            onClick(event);
        } else {
            event.preventDefault();
        }
    };

    if (submit && typeof children === "string")
        return <input type="submit" disabled={disabled} value={children} className={classNameResult} />;

    return (
        <button type="button" onClick={onButtonClick} disabled={disabled} className={classNameResult}>
            {children}
        </button>
    );
};

export { MyButton };
