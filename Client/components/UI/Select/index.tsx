import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { OptionType } from "../../../interfaces";
import styles from "./Select.module.scss";

interface SelectNodeProps {
    option: OptionType;
    onOptionClick(option: OptionType): void;
    isActiveOption(option: OptionType): boolean;
}

const SelectNode = ({ option, onOptionClick, isActiveOption }: SelectNodeProps) => {
    return (
        <div
            className={`${styles.selectNode} ${isActiveOption(option) && styles.active}`}
            onClick={() => {
                onOptionClick(option);
            }}
        >
            {option.title}
        </div>
    );
};

interface SelectProps {
    options: OptionType[];
    callback(value: string): void;
    stretch?: boolean;
    big?: boolean;
}

const Select = ({ options, callback, stretch, big }: SelectProps) => {
    const [selectedOption, setSelectedOption] = useState<OptionType>(options[0]);
    const [isOpen, setOpen] = useState(false);
    const dropdown = useRef(null);

    useEffect(() => {
        callback(selectedOption.value);
    }, [selectedOption]);

    useEffect(() => {
        if (!isOpen) return;
        function handleClick(event) {
            if (dropdown.current && !dropdown.current.contains(event.target)) {
                setOpen(false);
            }
        }
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, [isOpen]);

    const onOptionClick = (option: OptionType) => {
        setSelectedOption(option);
        setOpen(false);
    };

    const isActiveOption = (option: OptionType) => {
        return option.value === selectedOption.value;
    };

    return (
        <div className={`${styles.select} ${isOpen && styles.active} ${stretch && styles.stretch} ${big && styles.big}`}>
            <div
                className={styles.container}
                onClick={() => {
                    setOpen(true);
                }}
            >
                {selectedOption.title} <FontAwesomeIcon icon={faAngleDown} />
            </div>
            <div className={styles.dropdown} ref={dropdown}>
                {options.map((option, index) => (
                    <SelectNode key={index} option={option} onOptionClick={onOptionClick} isActiveOption={isActiveOption} />
                ))}
            </div>
        </div>
    );
};

export { Select };
