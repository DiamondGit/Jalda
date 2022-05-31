import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Loading } from "../components/LoadingWindow";
import { Modal } from "../components/UI/Modal";
import { MyButton } from "../components/UI/MyButton";
import { useAuthContext } from "../context/auth";
import { useStaticDataContext } from "../context/staticData";
import _categories from "../data/categories";
import { _contacts, _socials } from "../data/infos";
import _paths from "../data/paths";
import { ContactType, PartnerType, SocialType, UpCategoryNavType } from "../interfaces";
import styles from "../styles/Admin.module.scss";

interface AdminPageProps {
    categories: UpCategoryNavType[];
    socials: SocialType[];
    contacts: ContactType;
}

export const getServerSideProps: GetServerSideProps = async () => {
    const categories_URL = `${process.env.API_BACK}/categories`;
    const socials_URL = `${process.env.API_HOST}/infos/socials`;
    const contacts_URL = `${process.env.API_HOST}/infos/contacts`;

    try {
        const respCategories = await axios.get(categories_URL);
        const dataCategories = (await respCategories.data) || null;

        const respSocials = await axios.get(socials_URL);
        const dataSocials = (await respSocials.data) || null;

        const respContacts = await axios.get(contacts_URL);
        const dataContacts = (await respContacts.data) || null;

        return {
            props: {
                categories: dataCategories,
                socials: dataSocials,
                contacts: dataContacts,
            },
        };
    } catch (error) {
        return {
            props: { notFound: true },
        };
    }
};

interface RequestType {
    _id: string;
    sendDate: string;
    companyName: string;
    name: string;
    surname: string;
    fatherName?: string;
    iinNumber: string;
    email: string;
    phoneNumber: string;
}

interface RequestNodeProps {
    number: number;
    request: RequestType;
    openRequest(request: RequestType): void;
}

const Request = ({ number, request, openRequest }: RequestNodeProps) => {
    const date = new Date(request.sendDate);

    const format = (dateNum: number): string => {
        return `0${dateNum}`.slice(-2);
    };

    return (
        <div className={styles.request}>
            <div className={styles.number}>
                <h2>{number}</h2>
            </div>
            <div className={styles.companyName}>
                <h2>{request.companyName}</h2>
            </div>
            <div className={styles.name}>
                <h2>{`${request.surname} ${request.name} ${request.fatherName || ""}`.trim()}</h2>
            </div>
            <div className={styles.datetime}>
                <span className={styles.date}>{`${format(date.getDate())}.${format(date.getUTCMonth())}.${date.getUTCFullYear()}`}</span>
                <span className={styles.time}>{`${format(date.getUTCHours() + 6)}:${format(date.getUTCMinutes())}`}</span>
            </div>
            <div className={styles.detailedButton}>
                <MyButton
                    onClick={() => {
                        openRequest(request);
                    }}
                >
                    Подробнее
                </MyButton>
            </div>
        </div>
    );
};

export default function Admin({ categories, socials, contacts }: AdminPageProps) {
    const staticData = useStaticDataContext();
    const [loading, setLoading] = useState(true);
    const [requestsLoading, setRequestsLoading] = useState(true);
    const authContext = useAuthContext();
    const router = useRouter();

    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<RequestType>(null);

    if (!authContext.isLogged || authContext.role !== "Admin") {
        (async () => {
            await router.push(_paths.main);
        })();
    }

    const openRequest = (request: RequestType) => {
        setModalOpen(true);
        setSelectedRequest(request);
    };

    useEffect(() => {
        staticData.setDatas({
            categories: categories || staticData.get.categories || _categories,
            socials: socials || staticData.get.socials || _socials,
            contacts: contacts || staticData.get.contacts || _contacts,
        });

        if (authContext.isLogged && authContext.role === "Admin") setLoading(false);
    }, []);

    const list = [
        "rooms",
        "rooms/business",
        "rooms/business/teambuilding",
        "rooms/business/courses",
        "rooms/sport",
        "rooms/sport/dance",
        "rooms/sport/yoga",
    ];

    const [requests, setRequests] = useState<RequestType[]>(null);

    useEffect(() => {
        axios
            .get(`${process.env.API_BACK}/admin/waiting_authors`, {
                headers: {
                    authorization: `token ${authContext.token}`,
                },
            })
            .then((response) => {
                setRequests(response.data);
                setRequestsLoading(false);
            })
            .catch((error) => {
                console.log(error.message || error);
            });
    }, []);

    const onApproveRequest = () => {
        axios
            .post(
                `${process.env.API_BACK}/admin/waiting_authors/approve/${selectedRequest._id}`,
                { newStatus: "approved" },
                {
                    headers: {
                        authorization: `token ${authContext.token}`,
                    },
                }
            )
            .then((response) => {
                setRequests(response.data.result);
            })
            .catch((error) => {
                console.log(error.message || error);
            });
        setModalOpen(false);
        setSelectedRequest(null);
    };

    const onRejectRequest = () => {
        axios
            .post(
                `${process.env.API_BACK}/admin/waiting_authors/approve/${selectedRequest._id}`,
                { newStatus: "dismissed" },
                {
                    headers: {
                        authorization: `token ${authContext.token}`,
                    },
                }
            )
            .then((response) => {
                setRequests(response.data.result);
            })
            .catch((error) => {
                console.log(error.message || error);
            });
        setModalOpen(false);
        setSelectedRequest(null);
    };

    if (loading) return <Loading />;
    return (
        <Layout title="Заявки">
            <div className="wrapper">
                <Modal
                    title={`Заявка ${selectedRequest?.companyName}`}
                    openState={isModalOpen}
                    toggler={() => {
                        setModalOpen(!isModalOpen);
                    }}
                >
                    <div className={styles.modalBody}>
                        <div className={styles.infosContainer}>
                            {selectedRequest && (
                                <>
                                    <div>
                                        <span>Название организации:</span> {selectedRequest.companyName}
                                    </div>
                                    <div>
                                        <span>ФИО:</span>{" "}
                                        {`${selectedRequest.surname} ${selectedRequest.name} ${selectedRequest.fatherName || ""}`.trim()}
                                    </div>
                                    <div>
                                        <span>ИИН:</span> {selectedRequest.iinNumber}
                                    </div>
                                    <div>
                                        <span>Email:</span> {selectedRequest.email}
                                    </div>
                                    <div>
                                        <span>Номер телефона:</span> {selectedRequest.phoneNumber}
                                    </div>
                                </>
                            )}
                        </div>
                        <div className={styles.buttons}>
                            <MyButton secondary moreRounded small onClick={onRejectRequest}>
                                Отклонить
                            </MyButton>
                            <MyButton primary moreRounded small onClick={onApproveRequest}>
                                Одобрить заявку
                            </MyButton>
                        </div>
                    </div>
                </Modal>
                <div className={styles.mainContainer}>
                    <h1 className={styles.mainTitle}>Заявки</h1>
                    {!requestsLoading ? (
                        <>
                            {requests?.length > 0 ? (
                                <div className={styles.table}>
                                    <div className={styles.tableHeader}>
                                        <h2>Номер</h2>
                                        <h2>Название организации</h2>
                                        <h2>ФИО</h2>
                                        <h2>Время отправки</h2>
                                    </div>

                                    {requests.map((request, index) => (
                                        <Request key={request._id} request={request} number={index + 1} openRequest={openRequest} />
                                    ))}
                                </div>
                            ) : (
                                <h3 className={styles.notFound}>Заявок не найдено.</h3>
                            )}
                        </>
                    ) : (
                        <Loading fill />
                    )}
                </div>
            </div>
            <style>
                {`${
                    isModalOpen &&
                    `
                body {
                    overflow: hidden;
                }
                `
                }
                `}
            </style>
        </Layout>
    );
}
