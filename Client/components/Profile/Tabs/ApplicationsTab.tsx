import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthContext } from "../../../context/auth";
import { ApplicationModalType, ApplicationType, OptionType } from "../../../interfaces";
import styles from "../../../pages/profile/Profile.module.scss";
import { AdApplicationCard } from "../../AdApplicationCard";
import { ModalApplication } from "../../UI/Modal/ModalApplication";
import { Select } from "../../UI/Select";

const ApplicationsTab = () => {
    const { register, handleSubmit } = useForm();
    const authContext = useAuthContext();

    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<ApplicationType>();
    const [modalType, setModalType] = useState<ApplicationModalType>("detailModal");

    useEffect(() => {
        authContext.isAvailable();
    }, [isModalOpen]);

    const setApplicationModal = (modalState: boolean, application: ApplicationType, type: ApplicationModalType) => {
        setModalOpen(modalState);
        setSelectedApplication(application);
        setModalType(type);
    };

    const [myApplications, setMyApplications] = useState<ApplicationType[]>(null);

    const _myApplications: ApplicationType[] = [
        {
            _id: "A",
            bookInfos: [
                {
                    title: "date",
                    value: "2022-04-24",
                },
                {
                    title: "time",
                    value: {
                        from: "18:00",
                        till: "21:00",
                    },
                },
            ],
            bookNumber: "C83N61",
            status: "waiting",
            postId: "B",
            title: "Аренда конференц-зала",
            price: 3000,
            postImages: [
                "https://frankfurt.apollo.olxcdn.com/v1/files/n6d1j4x363ry-KZ/image;s=1000x700",
                "https://frankfurt.apollo.olxcdn.com/v1/files/smsv6b0vqz2n-KZ/image;s=1000x700",
                "https://frankfurt.apollo.olxcdn.com/v1/files/npipo2rn9j7a2-KZ/image;s=1000x700",
            ],
            description:
                "Разнообразный и богатый опыт консультация с широким активом напрямую зависит от дальнейших направлений развития. Равным образом высокотехнологичная концепция общественной системы обеспечивает актуальность укрепления демократической системы. Равным образом постоянное информационно-пропогандистское обеспечение нашей деятельности позволяет выполнять важные задания по разработке прогресса профессионального общества. <br /> Таким образом повышение уровня гражданского сознания создаёт предпосылки качественно новых шагов для экономической целесообразности принимаемых изменений. Задача организации, в особенности же повышение уровня гражданского сознания проверки влечёт за собой интересный процесс внедрения модернизации новых предложений.",
        },
        {
            _id: "B",
            bookInfos: [
                {
                    title: "date",
                    value: "2022-04-24",
                },
                {
                    title: "time",
                    value: {
                        from: "18:00",
                        till: "21:00",
                    },
                },
            ],
            bookNumber: "C83N61",
            status: "paid",
            postId: "B",
            title: "Аренда конференц-зала",
            price: 3000,
            postImages: [
                "https://frankfurt.apollo.olxcdn.com/v1/files/n6d1j4x363ry-KZ/image;s=1000x700",
                "https://frankfurt.apollo.olxcdn.com/v1/files/smsv6b0vqz2n-KZ/image;s=1000x700",
                "https://frankfurt.apollo.olxcdn.com/v1/files/npipo2rn9j7a2-KZ/image;s=1000x700",
            ],
            description:
                "Разнообразный и богатый опыт консультация с широким активом напрямую зависит от дальнейших направлений развития. Равным образом высокотехнологичная концепция общественной системы обеспечивает актуальность укрепления демократической системы. Равным образом постоянное информационно-пропогандистское обеспечение нашей деятельности позволяет выполнять важные задания по разработке прогресса профессионального общества. <br /> Таким образом повышение уровня гражданского сознания создаёт предпосылки качественно новых шагов для экономической целесообразности принимаемых изменений. Задача организации, в особенности же повышение уровня гражданского сознания проверки влечёт за собой интересный процесс внедрения модернизации новых предложений.",
        },
    ];

    useEffect(() => {
        {
            //request

            setMyApplications(_myApplications);
        }
    }, []);

    const sortOptions: OptionType[] = [
        {
            title: "Сначала новые",
            value: "new",
        },
        {
            title: "Сначала старые",
            value: "old",
        },
    ];

    const filterOptions: OptionType[] = [
        {
            title: "Ожидает ответа",
            value: "waiting",
        },
        {
            title: "Оплачено",
            value: "paid",
        },
    ];

    const [selectedFilter, setSelectedFilter] = useState<string>();
    const [selectedSort, setSelectedSort] = useState<string>();

    const onFilterClick = (value: string) => {
        setSelectedFilter(value);
    };

    const onSortClick = (value: string) => {
        setSelectedSort(value);
    };

    const onConfirmApplicationSearch = (data) => {
        alert(JSON.stringify(data));
    };

    return (
        <>
            {myApplications && myApplications.length > 0 ? (
                <>
                    <ModalApplication
                        application={selectedApplication}
                        type={modalType}
                        openState={isModalOpen}
                        setModalState={setModalOpen}
                        setApplicationModal={setApplicationModal}
                    />
                    <div className={styles.controlPanel}>
                        <div className={styles.group}>
                            <h3>Сортировать по</h3>
                            <Select options={sortOptions} callback={onSortClick} />
                        </div>
                        <div className={styles.group}>
                            <h3>Вывести только</h3>
                            <Select options={filterOptions} callback={onFilterClick} />
                        </div>
                        <form className={styles.searchForm} onSubmit={handleSubmit(onConfirmApplicationSearch)}>
                            <input
                                type="search"
                                placeholder="Поиск по брони"
                                {...register("search", {
                                    required: true,
                                })}
                                autoComplete="off"
                            />
                            <input type="submit" value={"Искать"} />
                        </form>
                    </div>
                    <div className={styles.applicationsContainer}>
                        {myApplications.map((myApplication) => (
                            <AdApplicationCard
                                application={myApplication}
                                key={myApplication._id}
                                setApplicationModal={setApplicationModal}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <h4 className={styles.notFound}>У вас пока нет заявок.</h4>
            )}
            <style>
                {`
                ${
                    isModalOpen &&
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

export { ApplicationsTab };
