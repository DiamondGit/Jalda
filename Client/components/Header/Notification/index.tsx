import { NotificationsContainer } from "./NotificationsContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell as farBell } from "@fortawesome/free-regular-svg-icons";
import styles from "../Header.module.scss";
import { useEffect, useRef, useState } from "react";
import { NotificationType, StatusType } from "../../../interfaces";
import { useAuthContext } from "../../../context/auth";
import { faAngleLeft, faXmark } from "@fortawesome/free-solid-svg-icons";

interface NotificationProps {
    toggleBurger(): void;
}

const Notification = ({ toggleBurger }: NotificationProps) => {
    const [newNotifCount, setNewNotifCount] = useState(0);
    const [isNotifActive, setNotifActive] = useState(false);
    const dropdownNotif = useRef(null);
    const authContext = useAuthContext();

    const [notifications, setNotifications] = useState<NotificationType[]>(null);

    const _notifications: NotificationType[] = [
        {
            id: "975hpmch",
            title: "Магазин “Skadi” принял вашу оплату. Операция успешно завершена.",
            date: new Date("November 28, 2021 11:58:00"),
            isNew: true,
            status: StatusType["completed"],
        },
        {
            id: "9hk3dtqx",
            title: "Магазин “Skadi” подтвердил вашу заявку. Произведите оплату перейдя в личный кабинет",
            date: new Date("December 17, 2021 19:30:00"),
            isNew: true,
            status: StatusType["payment"],
        },
        {
            id: "9gi44upj",
            title: "Таким образом выбранный нами инновационный путь способствует повышению качества поэтапного и последовательного развития общества.",
            date: new Date("November 28, 2021 11:58:00"),
            isNew: false,
            status: StatusType["processing"],
        },
        {
            id: "vg2r00kx",
            title: "Таким образом новая модель организационной деятельности в значительной степени обуславливает создание системы массового участия.",
            date: new Date("November 28, 2021 11:58:00"),
            isNew: false,
            status: StatusType["rejected"],
        },
        {
            id: "syjoifl8",
            title: "С другой стороны консультация с широким активом играет важную роль в формировании поставленных обществом и правительством задач.",
            date: new Date("November 01, 2021 11:58:00"),
            isNew: false,
            status: StatusType["rejected"],
        },
        {
            id: "xhchgzn3",
            title: "Не следует, однако, забывать, что понимание сущности ресурсосберегающих технологий позволяет оценить значение представляет собой интересный эксперимент укрепления демократической системы.",
            date: new Date("November 28, 2021 11:58:00"),
            isNew: false,
            status: StatusType["rejected"],
        },
        {
            id: "u0mk90q9",
            title: "Следует отметить, что выбранный нами инновационный путь играет важную роль в формировании направлений прогрессивного развития.",
            date: new Date("November 28, 2021 11:58:00"),
            isNew: false,
            status: StatusType["rejected"],
        },
        {
            id: "k4b5aofz",
            title: "Задача организации, в особенности же высокотехнологичная концепция общественной системы позволяет оценить значение представляет собой интересный эксперимент дальнейших направлений развития.",
            date: new Date("November 28, 2021 11:58:00"),
            isNew: false,
            status: StatusType["completed"],
        },
        {
            id: "1utx3g4g",
            title: "Не следует, однако, забывать, что социально-экономическое развитие позволяет выполнять важные задания по разработке существующий финансовых и административных условий.",
            date: new Date("November 28, 2021 11:58:00"),
            isNew: false,
            status: StatusType["rejected"],
        },
        {
            id: "tk4xv03n",
            title: "Равным образом высокотехнологичная концепция общественной системы обеспечивает актуальность прогресса профессионального общества.",
            date: new Date("November 28, 2021 11:58:00"),
            isNew: false,
            status: StatusType["payment"],
        },
    ];

    const onToggleNotif = () => {
        countNewNotif();
        setNotifActive(!isNotifActive);
    };

    const countNewNotif = () => {
        let count = 0;
        notifications?.forEach((notification) => {
            if (notification.isNew) count++;
        });
        setNewNotifCount(count);
    };

    useEffect(() => {
        countNewNotif();
    }, [notifications]);

    const readAllNotifs = () => {
        setNotifications((prevNotifs) =>
            prevNotifs?.map((prevNotif) => {
                return { ...prevNotif, isNew: false };
            })
        );
    };

    useEffect(() => {
        {
            //request
            setNotifications(_notifications);
        }
    }, []);

    useEffect(() => {
        if (!isNotifActive) return;
        function handleClick(event) {
            if (dropdownNotif.current && !dropdownNotif.current.contains(event.target)) {
                setNotifActive(false);
                readAllNotifs();
                countNewNotif();
            }
        }
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, [isNotifActive]);

    return (
        <span className={`${styles.notification} ${isNotifActive && styles.active}`}>
            <div onClick={onToggleNotif} className={styles.titleContainer}>
                <FontAwesomeIcon icon={farBell} className={styles.icon} />
                {!!newNotifCount && <span className={styles.count}>{newNotifCount}</span>}
                <span className={styles.title}>Уведомления</span>
            </div>
            <div className={styles.dropdown} ref={dropdownNotif}>
                <h3>
                    <FontAwesomeIcon
                        icon={faAngleLeft}
                        onClick={() => {
                            onToggleNotif();
                            readAllNotifs();
                        }}
                        className={styles.closeNotif}
                    />
                    Уведомления
                    <FontAwesomeIcon
                        icon={faXmark}
                        className={styles.closeBurger}
                        onClick={() => {
                            onToggleNotif();
                            readAllNotifs();
                            toggleBurger();
                        }}
                    />
                </h3>
                <NotificationsContainer notifications={notifications} />
            </div>
        </span>
    );
};

export { Notification };
