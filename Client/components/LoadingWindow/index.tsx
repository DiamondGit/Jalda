import Image from "next/image";
import styles from "./Loading.module.scss";

interface LoadingProps {
    fill?: boolean;
}

const Loading = ({ fill = false }: LoadingProps) => {
    const loadingComponent = (
        <div className={styles.container}>
            <div className={styles.logoContainer}>
                <Image src={"/brand/logo.png"} layout="fill" objectFit="contain" alt="Logo" priority />
            </div>
        </div>
    );
    return fill ? <div className={styles.fill}>{loadingComponent}</div> : loadingComponent;
};

export { Loading };
