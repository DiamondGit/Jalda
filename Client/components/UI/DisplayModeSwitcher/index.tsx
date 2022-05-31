import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./DisplayModeSwitcher.module.scss";

interface SwitcherProps {
    onClickSwitch(mode: boolean): void;
}

const DisplayModeSwitcher = ({ onClickSwitch }: SwitcherProps) => {
    const [isGridMode, setGridMode] = useState(true);

    useEffect(() => {
        onClickSwitch(isGridMode);
    }, [isGridMode]);

    return (
        <div className={styles.container}>
            <div
                className={styles.icon}
                onClick={() => {
                    setGridMode(true);
                }}
            >
                <Image
                    src={`/icons/gridButton/grid_${isGridMode ? "red" : "gray"}.svg`}
                    layout="fill"
                    objectFit="contain"
                    priority
                    unoptimized
                />
            </div>
            <div
                className={styles.icon}
                onClick={() => {
                    setGridMode(false);
                }}
            >
                <Image
                    src={`/icons/gridButton/row_${!isGridMode ? "red" : "gray"}.svg`}
                    layout="fill"
                    objectFit="contain"
                    priority
                    unoptimized
                />
            </div>
        </div>
    );
};

export { DisplayModeSwitcher };
