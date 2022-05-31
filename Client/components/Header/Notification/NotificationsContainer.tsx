import { NotificationType, StatusType } from "../../../interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import styles from "../Header.module.scss";
import { _monthNames } from "../../../data";

interface Props {
    notifications: NotificationType[];
}

const NotificationsContainer = ({ notifications }: Props) => {
    return (
        <div className={styles.notifsContainer}>
            {notifications && notifications.length > 0 ? (
                notifications.map((notif) => (
                    <div key={notif.id} className={`${styles.container} ${styles[StatusType[notif.status]]} ${notif.isNew && styles.new}`}>
                        <div className={styles.statusLine} />
                        <div className={styles.content}>
                            <h4>{notif.title}</h4>
                            <span>
                                <FontAwesomeIcon icon={faClock} className={styles.icon} />
                                {notif.date.getDate()} {_monthNames[notif.date.getMonth()]}, {notif.date.getHours()}:
                                {notif.date.getMinutes()}
                            </span>
                        </div>
                    </div>
                ))
            ) : (
                <h4>У Вас пока нет уведомлений</h4>
            )}
        </div>
    );
};
export { NotificationsContainer };
