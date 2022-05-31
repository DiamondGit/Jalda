import { faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../../context/auth";
import _paths from "../../../data/paths";
import { CreditCardType } from "../../../interfaces";
import styles from "../../../pages/profile/Profile.module.scss";
import { CreditCard } from "../../CreditCard";
import { Modal } from "../../UI/Modal";
import { ModalSuccess } from "../../UI/Modal/ModalSuccess";
import { AddCreditCard } from "../Modals/AddCreditCard";
import { ChangeInfo } from "../Modals/ChangeInfo";
import { ChangePassword } from "../Modals/ChangePassword";
import { DeleteCreditCard } from "../Modals/DeleteCreditCard";

const ProfileTab = () => {
    const authContext = useAuthContext();
    const router = useRouter();

    const [isAddCreditCardModalOpen, setAddCreditCardModalOpen] = useState(false);
    const [isDeleteCreditCardModalOpen, setDeleteCreditCardModalOpen] = useState(false);
    const [isChangeInfoModalOpen, setChangeInfoModalOpen] = useState(false);
    const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
    const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);

    const isAnyModalOpen = isAddCreditCardModalOpen || isDeleteCreditCardModalOpen || isChangeInfoModalOpen || isChangePasswordModalOpen;

    useEffect(() => {
        authContext.isAvailable();
    }, [isAnyModalOpen]);

    const [cardToDelete, setCardToDelete] = useState<CreditCardType>(null);

    const userInfo = authContext.user;
    const isAuthor = authContext.role === "Author";

    const onConfirmDeleteCard = (cardId: string) => {
        axios
            .delete(`${process.env.API_BACK}/user/delete_credit_card/${cardId}`, {
                headers: {
                    authorization: `token ${authContext.token}`,
                },
            })
            .then((response) => {
                authContext.refreshInfo(response.data.result);
            })
            .catch((error) => {
                console.log(error.message || error);
            });
        onCancelDeleteCard();
    };

    const onCancelDeleteCard = () => {
        setCardToDelete(null);
        setDeleteCreditCardModalOpen(false);
    };

    const onDeleteCard = (card: CreditCardType) => {
        setCardToDelete(card);
        setDeleteCreditCardModalOpen(true);
    };

    const onLogout = () => {
        authContext.logout();
        (async () => {
            await router.push(_paths.main);
        })();
    };

    return (
        <>
            <Modal title="Привязка карты" openState={isAddCreditCardModalOpen} toggler={setAddCreditCardModalOpen}>
                <AddCreditCard
                    modalState={isAddCreditCardModalOpen}
                    onClose={() => {
                        setAddCreditCardModalOpen(false);
                    }}
                />
            </Modal>
            <Modal title="Удаление карты" openState={isDeleteCreditCardModalOpen} toggler={setDeleteCreditCardModalOpen}>
                <DeleteCreditCard card={cardToDelete} onConfirm={onConfirmDeleteCard} onCalcel={onCancelDeleteCard} />
            </Modal>
            <Modal title="Изменение данных" openState={isChangeInfoModalOpen} toggler={setChangeInfoModalOpen} form>
                <ChangeInfo
                    userInfo={userInfo}
                    modalState={isChangeInfoModalOpen}
                    onClose={() => {
                        setChangeInfoModalOpen(false);
                    }}
                />
            </Modal>
            <Modal title="Изменение пароля" openState={isChangePasswordModalOpen} toggler={setChangePasswordModalOpen} form>
                <ChangePassword
                    modalState={isChangePasswordModalOpen}
                    onClose={() => {
                        setChangePasswordModalOpen(false);
                    }}
                    openSuccessModal={() => {
                        setSuccessModalOpen(true);
                    }}
                />
            </Modal>
            <ModalSuccess
                title="Ваш пароль успешно изменен!"
                buttonText="Закрыть"
                openState={isSuccessModalOpen}
                toggler={() => {
                    setSuccessModalOpen(!isSuccessModalOpen);
                }}
            />
            <div className={styles.profileInfo}>
                <div className={`${styles.container} ${styles.infos}`}>
                    <div className={styles.upPart}>
                        <div className={styles.profile}>
                            <div className={styles.imageContainer}>
                                <div className={styles.image}>
                                    <Image
                                        src={userInfo.image || "/defaultUserPicture.png"}
                                        layout="fill"
                                        objectFit="cover"
                                        placeholder="blur"
                                        blurDataURL="/placeholder-image.jpg"
                                        alt={"Profile image"}
                                    />
                                </div>
                                <div className={styles.changeImage}>
                                    <div className={styles.icon}>
                                        <Image src="/icons/camera.svg" layout="fill" objectFit="contain" alt={"Camera icon"} />
                                    </div>
                                </div>
                            </div>
                            <h2 className={styles.title}>
                                {isAuthor ? userInfo.companyName : `${userInfo?.name} ${userInfo?.surname || ""}`.trim()}
                            </h2>
                        </div>
                        <button
                            className={styles.edit}
                            onClick={() => {
                                setChangeInfoModalOpen(true);
                            }}
                        >
                            <FontAwesomeIcon icon={faPencil} className={styles.icon} /> Редактировать
                        </button>
                    </div>
                    <div className={styles.content}>
                        <div>
                            <h4>E-mail</h4>
                            <span>{userInfo?.email}</span>
                        </div>

                        {userInfo?.phoneNumber &&
                            userInfo.phoneNumber
                                .slice(2)
                                .replaceAll(" ", "")
                                .replaceAll("-", "")
                                .replaceAll("_", "")
                                .replace("+", "")
                                .replace(")", "")
                                .replace("(", "").length !== 0 && (
                                <div>
                                    <h4>Телефон</h4>
                                    <span>{userInfo?.phoneNumber}</span>
                                </div>
                            )}

                        {isAuthor ? (
                            <>
                                <div>
                                    <h4>ИИН</h4>
                                    <span>{userInfo?.iinNumber}</span>
                                </div>
                                <div>
                                    <h4>ФИО</h4>
                                    <span>{`${userInfo?.surname || ""} ${userInfo?.name} ${userInfo?.fathername || ""}`.trim()}</span>
                                </div>
                            </>
                        ) : (
                            <div>
                                <h4>Дата рождения</h4>
                                <span>{[...userInfo?.birthDate?.slice(0, 10).split("-")].reverse().join(".")}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className={`${styles.container} ${styles.creditCards}`}>
                    <h2 className={styles.title}>Привязанные карты</h2>
                    <div className={styles.cards}>
                        {authContext.user.creditCards?.map((creditCard, index) => (
                            <CreditCard creditCard={creditCard} key={index} onDeleteCard={onDeleteCard} />
                        ))}
                        <div
                            className={styles.addCard}
                            onClick={() => {
                                setAddCreditCardModalOpen(true);
                            }}
                        >
                            <span>
                                <div className={styles.icon}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </div>
                                Добавить карту
                            </span>
                        </div>
                    </div>
                </div>
                <div
                    className={`${styles.container} ${styles.password}`}
                    onClick={() => {
                        setChangePasswordModalOpen(true);
                    }}
                >
                    <h2 className={styles.title}>Изменить пароль</h2>
                </div>
                <div className={`${styles.container} ${styles.exit}`} onClick={onLogout}>
                    <h2 className={styles.title}>Выйти</h2>
                </div>
            </div>
            <style>
                {`
                    ${
                        isAnyModalOpen &&
                        `
                        body{
                            overflow: hidden;
                        }
                    `
                    }
                `}
            </style>
        </>
    );
};

export { ProfileTab };
