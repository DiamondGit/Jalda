import styles from "./Accordion.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faCircleMinus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { FaqType } from "../../../interfaces";

const Accordion = ({ title, content, countable }: FaqType) => {
    const [isOpen, setOpen] = useState(false);

    const onToggleOpen = () => {
        setOpen(!isOpen);
    };

    return (
        <div className={styles.accordion}>
            <div className={styles.heading} onClick={onToggleOpen}>
                <h3>{title}</h3>
                <FontAwesomeIcon className={styles.icon} icon={isOpen ? faCircleMinus : faCirclePlus} />
            </div>
            <div className={`${styles.content} ${isOpen && styles.active}`}>
                {countable ? (
                    <ol>
                        {content.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ol>
                ) : (
                    <>
                        {content.map((item, index) => (
                            <p key={index}>{item}</p>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export { Accordion };
