import _paths from "../../data/paths";
import { BreadcrumbNodeType, UpCategoryNavType, MidCategoryNavType, LowCategoryNavType } from "../../interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import styles from "./Filter.module.scss";
import { useCallback, useEffect, useState } from "react";
import { useBreadcrumbsContext } from "../../context/breadcrumbs";

interface FilterProps {
    categories: UpCategoryNavType[];
    changeUrl(path: string): void;
    currentFilterPath: string | string[];
    toggleVisible(outsideProp?: boolean): void;
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
    refreshTrigger: number;
    subs?: CategoryStateLow[];
}

interface CategoryStateUp {
    name: string;
    path: string;
    isActive: boolean;
    refreshTrigger: number;
    subs?: CategoryStateMid[];
}

interface UpLevelProps extends UpCategoryNavType {
    categoryStates: CategoryStateUp;
    changeUrl(path: string): void;
    refreshFilter(selectedPaths: string[]): void;
}

interface MidLevelProps extends MidCategoryNavType {
    categoryStates: CategoryStateMid;
    changeUrl(path: string): void;
    refreshFilter(selectedPaths: string[]): void;
}

interface LowLevelProps extends LowCategoryNavType {
    categoryStates: CategoryStateLow;
    changeUrl(path: string): void;
    refreshFilter(selectedPaths: string[]): void;
}

const LowLevel = ({ name, path, categoryStates, changeUrl, refreshFilter }: LowLevelProps) => {
    if (!categoryStates) return null;

    return (
        <div className={`${styles.lowLevel} ${categoryStates.isActive && styles.active}`}>
            <h3
                onClick={() => {
                    changeUrl(path);
                    refreshFilter(path.split("/").slice(2, 5));
                }}
            >
                {name}
            </h3>
        </div>
    );
};

const MidLevel = ({ name, path, subcategories, categoryStates, changeUrl, refreshFilter }: MidLevelProps) => {
    if (!categoryStates) return null;

    const [isOpen, setOpen] = useState(categoryStates.isActive);

    useEffect(() => {
        setOpen(categoryStates.isActive);
    }, [categoryStates.refreshTrigger]);

    const onToggleOpen = () => {
        setOpen(!isOpen);
    };

    return (
        <div className={`${styles.midLevel} ${categoryStates.isActive && styles.active} ${isOpen && styles.open}`}>
            <div
                className={styles.title}
                onClick={() => {
                    onToggleOpen();
                }}
            >
                <h2
                    onClick={() => {
                        changeUrl(path);
                        refreshFilter(path.split("/").slice(2, 4));
                    }}
                >
                    {name}
                </h2>
                {subcategories.length !== 0 && <FontAwesomeIcon className={styles.icon} icon={faAngleRight} />}
            </div>
            {subcategories.length !== 0 &&
                subcategories.map((subcategory, index) => (
                    <LowLevel
                        key={subcategory._id}
                        {...subcategory}
                        path={`${path}/${subcategory.path}`}
                        categoryStates={categoryStates.subs[index]}
                        changeUrl={changeUrl}
                        refreshFilter={refreshFilter}
                    />
                ))}
        </div>
    );
};

const UpLevel = ({ name, path, subcategories, categoryStates, changeUrl, refreshFilter }: UpLevelProps) => {
    if (!categoryStates) return null;

    const [isOpen, setOpen] = useState(categoryStates.isActive);

    useEffect(() => {
        setOpen(categoryStates.isActive);
    }, [categoryStates.refreshTrigger]);

    const onToggleOpen = () => {
        setOpen(!isOpen);
    };

    return (
        <div className={`${styles.upLevel} ${categoryStates.isActive && styles.active} ${isOpen && styles.open}`}>
            <div
                className={styles.title}
                onClick={() => {
                    onToggleOpen();
                }}
            >
                <h1
                    onClick={() => {
                        changeUrl(path);
                        refreshFilter(path.split("/").slice(2, 3));
                    }}
                >
                    {name}
                </h1>
                {subcategories.length !== 0 && <FontAwesomeIcon className={styles.icon} icon={faAngleRight} />}
            </div>

            {subcategories.length !== 0 &&
                subcategories.map((subcategory, index) => (
                    <MidLevel
                        key={subcategory._id}
                        {...subcategory}
                        path={`${path}/${subcategory.path}`}
                        categoryStates={categoryStates.subs[index]}
                        changeUrl={changeUrl}
                        refreshFilter={refreshFilter}
                    />
                ))}
        </div>
    );
};

const Filter = ({ categories, changeUrl, currentFilterPath, toggleVisible }: FilterProps) => {
    if (!categories) return null;

    const breadcrumbsContext = useBreadcrumbsContext();

    const getStartCategoryState = (categoriesArray: UpCategoryNavType[]): CategoryStateUp[] => {
        const temp: CategoryStateUp[] = [];
        categoriesArray.forEach((upLevel, i) => {
            if (upLevel.subcategories) {
                temp[i] = { name: upLevel.name, path: upLevel.path, isActive: false, refreshTrigger: Date.now(), subs: [] };
                upLevel.subcategories.forEach((midLevel, j) => {
                    if (midLevel.subcategories) {
                        temp[i].subs[j] = {
                            name: midLevel.name,
                            path: midLevel.path,
                            isActive: false,
                            refreshTrigger: Date.now(),
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
                        temp[i].subs[j] = { name: midLevel.name, path: midLevel.path, isActive: false, refreshTrigger: Date.now() };
                    }
                });
            } else temp[i] = { name: upLevel.name, path: upLevel.path, isActive: false, refreshTrigger: Date.now() };
        });
        return temp;
    };

    const [categoryStates, setCategoryStates] = useState<CategoryStateUp[]>(getStartCategoryState(categories));

    const refreshFilter = useCallback((selectedPath: string | string[]) => {
        let breadcrumbsTemp: BreadcrumbNodeType[] = [];
        breadcrumbsTemp.push({ name: "Все объявления", path: _paths.adFeed });

        toggleVisible(false);

        setCategoryStates(() => {
            let tempStates = getStartCategoryState(categories);

            if (selectedPath.length === 0) return tempStates;

            tempStates.forEach((upLevel: CategoryStateUp) => {
                upLevel.refreshTrigger = Date.now();
                if (upLevel.path === selectedPath[0]) {
                    upLevel.isActive = true;
                    breadcrumbsTemp.push({ name: upLevel.name, path: `${breadcrumbsTemp[0].path}/${upLevel.path}` });
                    if (selectedPath[1]) {
                        upLevel.subs.forEach((midLevel: CategoryStateMid) => {
                            midLevel.refreshTrigger = Date.now();
                            if (midLevel.path === selectedPath[1]) {
                                midLevel.isActive = true;
                                breadcrumbsTemp.push({ name: midLevel.name, path: `${breadcrumbsTemp[1].path}/${midLevel.path}` });
                                if (selectedPath[2]) {
                                    midLevel.subs.forEach((lowLevel: CategoryStateLow) => {
                                        if (lowLevel.path === selectedPath[2]) {
                                            lowLevel.isActive = true;
                                            breadcrumbsTemp.push({
                                                name: lowLevel.name,
                                                path: `${breadcrumbsTemp[2].path}/${lowLevel.path}`,
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });

            setTimeout(async () => {
                await breadcrumbsContext.setBreadcrumbs(breadcrumbsTemp);
            });

            return tempStates;
        });
        breadcrumbsContext.setBreadcrumbs(breadcrumbsTemp);
    }, []);

    useEffect(() => {
        refreshFilter(currentFilterPath);
    }, [currentFilterPath]);

    return (
        <div className={styles.filter}>
            <div className={styles.windowTitle}>
                Фильтр
                <div
                    className={styles.closeButton}
                    onClick={() => {
                        toggleVisible();
                    }}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </div>
            </div>
            {categories.map((category, index) => (
                <UpLevel
                    key={category._id}
                    {...category}
                    path={`${_paths.adFeed}/${category.path}`}
                    changeUrl={changeUrl}
                    categoryStates={categoryStates[index]}
                    refreshFilter={refreshFilter}
                />
            ))}
        </div>
    );
};

export { Filter };
