import _paths from "../../data/paths";
import { UpCategoryNavType, MidCategoryNavType, LowCategoryNavType, OptionType } from "../../interfaces";
import styles from "./CategorySelect.module.scss";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Select } from "../UI/Select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

interface FilterSelectProps {
    categories: UpCategoryNavType[];
    categoriesValue: string[];
    setCategoriesValue: Dispatch<SetStateAction<string[]>>;
    hangleCategoryChange: Dispatch<SetStateAction<UpCategoryNavType>>;
}

interface CategoryStateLow {
    name: string;
    path: string;
    isActive: boolean;
    subs?: null;
}

interface CategoryStateMid {
    name: string;
    path: string;
    isActive: boolean;
    subs?: CategoryStateLow[];
}

interface CategoryStateUp {
    name: string;
    path: string;
    isActive: boolean;
    subs?: CategoryStateMid[];
}

interface UpLevelProps extends UpCategoryNavType {
    categoryStates: CategoryStateUp;
    toggleChange(path: string): void;
    value: string[];
}

interface MidLevelProps extends MidCategoryNavType {
    categoryStates: CategoryStateMid;
    toggleChange(path: string): void;
    value: string[];
}

interface LowLevelProps extends LowCategoryNavType {
    categoryStates: CategoryStateLow;
    toggleChange(path: string): void;
    value: string[];
}

const LowLevel = ({ name, path, categoryStates, toggleChange, value }: LowLevelProps) => {
    if (!categoryStates) return null;

    return (
        <div className={styles.lowLevelNode}>
            <div className={styles.header}>
                <input
                    type="checkbox"
                    checked={value.includes(path)}
                    onChange={() => {
                        toggleChange(path);
                    }}
                />
                <h3
                    className={styles.title}
                    onClick={() => {
                        toggleChange(path);
                    }}
                >
                    {name}
                </h3>
            </div>
        </div>
    );
};

const MidLevel = ({ name, path, subcategories, categoryStates, toggleChange, value }: MidLevelProps) => {
    const [isOpen, setOpen] = useState(false);

    if (!categoryStates) return null;

    return (
        <div className={`${styles.midLevel} ${isOpen && styles.open} ${subcategories.length !== 0 && styles.canOpen}`}>
            <div className={styles.header}>
                <input
                    type="checkbox"
                    checked={value.includes(path)}
                    onChange={() => {
                        toggleChange(path);
                    }}
                />
                <h2
                    className={styles.title}
                    onClick={() => {
                        if (!(subcategories.length !== 0)) toggleChange(path);
                        else setOpen(!isOpen);
                    }}
                >
                    {name}
                </h2>
                {subcategories.length !== 0 && (
                    <FontAwesomeIcon
                        icon={faAngleDown}
                        className={styles.icon}
                        onClick={() => {
                            setOpen(!isOpen);
                        }}
                    />
                )}
            </div>
            {subcategories.length !== 0 && (
                <div className={styles.lowLevel}>
                    {subcategories.map((subcategory, index) => (
                        <LowLevel
                            key={subcategory._id}
                            {...subcategory}
                            path={`${path}/${subcategory.path}`}
                            categoryStates={categoryStates.subs[index]}
                            toggleChange={toggleChange}
                            value={value}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const CategorySelect = ({ categories, categoriesValue, setCategoriesValue, hangleCategoryChange }: FilterSelectProps) => {
    const getStartCategoryState = (categoriesArray: UpCategoryNavType[]): CategoryStateUp[] => {
        const temp: CategoryStateUp[] = [];
        categoriesArray.forEach((upLevel, i) => {
            if (upLevel.subcategories) {
                temp[i] = { name: upLevel.name, path: upLevel.path, isActive: false, subs: [] };
                upLevel.subcategories.forEach((midLevel, j) => {
                    if (midLevel.subcategories) {
                        temp[i].subs[j] = {
                            name: midLevel.name,
                            path: midLevel.path,
                            isActive: false,
                            subs: [],
                        };
                        midLevel.subcategories.forEach((lowLevev, k) => {
                            temp[i].subs[j].subs[k] = {
                                name: lowLevev.name,
                                path: lowLevev.path,
                                isActive: false,
                            };
                        });
                    } else {
                        temp[i].subs[j] = { name: midLevel.name, path: midLevel.path, isActive: false };
                    }
                });
            } else temp[i] = { name: upLevel.name, path: upLevel.path, isActive: false };
        });
        return temp;
    };

    const [categoryStates, setCategoryStates] = useState<CategoryStateUp[]>(getStartCategoryState(categories));

    const toggleChange = (receivedPath: string) => {
        if (categoriesValue.includes(receivedPath)) {
            setCategoriesValue((prevvalue) => prevvalue.filter((category) => !category.startsWith(receivedPath)));
        } else {
            const splitedPath = receivedPath.split("/");
            let tempPaths = [];
            splitedPath.forEach((_, index) => {
                const tempPath = splitedPath.slice(0, index + 1).join("/");
                if (!categoriesValue.includes(tempPath)) tempPaths = [...tempPaths, tempPath];
            });
            setCategoriesValue([...categoriesValue, ...tempPaths]);
        }
    };

    const [selectedCategory, setCategory] = useState(categoryStates[0]);
    const [selectedCategoryValue, setCategoryValue] = useState(categoryStates[0].path);

    useEffect(() => {
        setCategory(categoryStates.find((categoryState) => categoryState.path === selectedCategoryValue));
        hangleCategoryChange(categories.find((category) => category.path === selectedCategoryValue));
        setCategoriesValue([]);
    }, [selectedCategoryValue]);

    const selectOptions: OptionType[] = [
        ...categoryStates.map((categoryState) => ({ title: categoryState.name, value: categoryState.path })),
    ];

    return (
        <div className={styles.filter}>
            <Select stretch big options={selectOptions} callback={setCategoryValue} />
            <div className={styles.categories}>
                {categories
                    .find((category) => category.path === selectedCategory.path)
                    .subcategories.map((category, index) => (
                        <MidLevel
                            key={category._id}
                            {...category}
                            categoryStates={selectedCategory.subs[index]}
                            toggleChange={toggleChange}
                            value={categoriesValue}
                        />
                    ))}
            </div>
        </div>
    );
};

export { CategorySelect };
