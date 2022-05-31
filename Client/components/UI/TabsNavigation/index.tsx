import { TabType } from "../../../interfaces";
import styles from "./TabsNavigation.module.scss";

interface TabsProps {
    tabs: TabType[];
    selectedTab: TabType;
    setTab(tab: TabType): void;
}

const TabsNavigation = ({ tabs, selectedTab, setTab }: TabsProps) => {
    return (
        <div className={styles.tabsContainer}>
            {tabs.map((tab, index) => (
                <div
                    className={`${styles.tab} ${selectedTab.value === tab.value && styles.active} ${
                        index === 0 ? styles.firstTab : index === tabs.length - 1 && styles.lastTab
                    }`}
                    key={index}
                    onClick={() => {
                        setTab(tab);
                    }}
                >
                    {tab.title}
                </div>
            ))}
        </div>
    );
};

export { TabsNavigation };
