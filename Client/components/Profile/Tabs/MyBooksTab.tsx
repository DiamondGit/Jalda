import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthContext } from "../../../context/auth";
import { BookType, ModalType, OptionType } from "../../../interfaces";
import styles from "../../../pages/profile/Profile.module.scss";
import { AdBookCard } from "../../AdBookCard";
import { ModalBook } from "../../UI/Modal/ModalBook";
import { Select } from "../../UI/Select";

const MyBooksTab = () => {
    const { register, handleSubmit } = useForm();
    const authContext = useAuthContext();

    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<BookType>(null);
    const [modalType, setModalType] = useState<ModalType>("detailModal");

    useEffect(() => {
        authContext.isAvailable();
    }, [isModalOpen]);

    const setBookModal = (modalState: boolean, book: BookType, type: ModalType) => {
        setModalOpen(modalState);
        setSelectedBook(book);
        setModalType(type);
    };

    const [myBooks, setMyBooks] = useState<BookType[]>(null);

    const _myBooks: BookType[] = [
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
            status: "rejected",
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
            status: "processing",
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
            _id: "C",
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
            status: "payment",
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
            _id: "D",
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
            status: "completed",
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

            setMyBooks(_myBooks);
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
            title: "В обработке",
            value: "processing",
        },
        {
            title: "Ожидает оплату",
            value: "payment",
        },
        {
            title: "Отклонен",
            value: "rejected",
        },
        {
            title: "Завершен",
            value: "completed",
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

    const onConfirmBookSearch = (data) => {
        alert(JSON.stringify(data));
    };

    return (
        <>
            {myBooks && myBooks.length > 0 ? (
                <>
                    <ModalBook
                        book={selectedBook}
                        type={modalType}
                        openState={isModalOpen}
                        setModalState={setModalOpen}
                        setBookModal={setBookModal}
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
                        <form className={styles.searchForm} onSubmit={handleSubmit(onConfirmBookSearch)}>
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
                    <div className={styles.booksContainer}>
                        {myBooks.map((myBook) => (
                            <AdBookCard book={myBook} setBookModal={setBookModal} key={myBook._id} />
                        ))}
                    </div>
                </>
            ) : (
                <h4 className={styles.notFound}>У вас пока нет броней.</h4>
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

export { MyBooksTab };
