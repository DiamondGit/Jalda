import { faHeart as fasHeart, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Breadcrumbs } from "../../components/UI/Breadcrumbs";
import { RatingStars } from "../../components/UI/RatingStars";
import { useBreadcrumbsContext } from "../../context/breadcrumbs";
import { useStaticDataContext } from "../../context/staticData";
import styles from "./Post.module.scss";
import Image from "next/image";
import { SectionContainer } from "../../components/UI/SectionContainer";
import { ReviewRating } from "../../components/UI/ReviewRating";
import { MyButton } from "../../components/UI/MyButton";
import { CommentCard } from "../../components/CommentCard";
import AliceCarousel from "react-alice-carousel";
import { AdCardItem } from "../../components/AdCardItem";
import { AuthorCard } from "../../components/AuthorCard";
import { setTimeout } from "timers";
import _paths from "../../data/paths";
import { AdCardType, BreadcrumbNodeType, PostType } from "../../interfaces";
import { Map } from "../../components/Map";
import { Loading } from "../../components/LoadingWindow";
import { useAuthContext } from "../../context/auth";
import { _monthNames, _sexTypes } from "../../data";
import { Modal } from "../../components/UI/Modal";
import _categories from "../../data/categories";
import { _contacts, _socials } from "../../data/infos";
import { getDecodeStorage, useDeclension } from "../../functions";
import { MyCalendar } from "../../components/UI/MyCalendar";
import { MySlider } from "../../components/UI/MySlider";
import { ModalSuccess } from "../../components/UI/Modal/ModalSuccess";

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

export default function Post({ categories, contacts, socials }) {
    const breadcrumbsContext = useBreadcrumbsContext();
    const staticData = useStaticDataContext();
    const authContext = useAuthContext();
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const { _id: queryId } = router.query;

    const [isImageModalCarouselActive, setImageModalCarouselActive] = useState<boolean>(false);
    const [clickedImageIndex, setClickedImageIndex] = useState<number>(0);

    const openModalCarousel = () => {
        setTimeout(() => {
            setImageModalCarouselActive(true);
        }, 0);
    };

    const isAdmin = authContext.role === "Admin";
    if (authContext.isLogged && isAdmin) {
        (async () => {
            await router.push(_paths.admin);
        })();
    }

    const [postId] = useState<string>(queryId[0]);
    const [post, setPost] = useState<PostType>(null);

    const [similarPosts, setSimilarPostIds] = useState<AdCardType[]>(null);
    const [similarPostsPage, setSimilarPostsPage] = useState(1);
    const [similarPostsPageCount, setSimilarPostsPageCount] = useState(1);

    const [isFavorite, setFavorite] = useState(false);
    const [isBookModalOpen, setBookModalOpen] = useState(false);
    const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);

    const toggleFavorite = () => {
        if (authContext.isLogged) {
            try {
                axios
                    .patch(`${process.env.API_BACK}/posts/${queryId}/addToFavorites`, null, {
                        headers: {
                            authorization: `token ${authContext.token}`,
                        },
                    })
                    .then((response) => {
                        authContext.refreshInfo(response.data);
                    })
                    .catch((error) => {
                        console.log(error.message || error);
                    });
            } catch (error) {}
        } else {
            if (localStorage) {
                if (isFavorite) {
                    //remove from favorites
                    localStorage.setItem(
                        "favorites",
                        JSON.stringify(
                            [...JSON.parse(localStorage.getItem("favorites"))].filter(
                                (favPost) => JSON.stringify(favPost) !== JSON.stringify(postId)
                            )
                        )
                    );
                } else {
                    //add to favorites
                    if (localStorage.getItem("favorites")) {
                        localStorage.setItem("favorites", JSON.stringify([...JSON.parse(localStorage.getItem("favorites")), postId]));
                    } else {
                        localStorage.setItem("favorites", JSON.stringify([postId]));
                    }
                }
            }
        }
        setFavorite(!isFavorite);
    };

    const onClickImage = (index: number) => {
        setClickedImageIndex(index);
        openModalCarousel();
    };

    useEffect(() => {
        staticData.setDatas({
            categories: categories || staticData.get.categories || _categories,
            socials: socials || staticData.get.socials || _socials,
            contacts: contacts || staticData.get.contacts || _contacts,
        });

        if (queryId.length > 1) {
            router.push(
                {
                    pathname: `${_paths.post}/${postId}`,
                },
                undefined,
                { shallow: true }
            );
        }

        if (localStorage) {
            createBreadcrumbs();

            if (JSON.parse(localStorage.getItem("open_book_modal"))) {
                setBookModalOpen(true);
                localStorage.removeItem("open_book_modal");
            }
        }
    }, []);

    useEffect(() => {
        axios
            .get(`${process.env.API_BACK}/posts/${queryId}`)
            .then((response) => {
                setPost(response.data);

                const currentPostCategory = response.data.category
                    .filter(
                        (element: string) => !response.data.category.some((other: string) => other.startsWith(element) && other !== element)
                    )
                    .join(",");

                axios
                    .patch(
                        `${process.env.API_BACK}/posts/${response.data._id}/similars?categories=${currentPostCategory}&page=${similarPostsPage}`
                    )
                    .then((responseSim) => {
                        setSimilarPostIds(responseSim.data.data);
                        setSimilarPostsPageCount(responseSim.data.numberOfPages);
                    })
                    .catch((error) => {
                        console.log(error.message || error);
                    });

                if (!isAdmin && !JSON.parse(getDecodeStorage("logged_user-data"))?.roles.some((userRole) => userRole.name === "Admin"))
                    setLoading(false);
            })
            .catch((error) => {
                console.log(error.message || error);
            });

        if (!authContext.isLogged) {
            if (localStorage && localStorage.getItem("favorites")) {
                setFavorite([...JSON.parse(localStorage.getItem("favorites"))].some((favPostId) => favPostId === postId));
            }
        }
    }, [router.asPath]);

    useEffect(() => {
        if (post) {
            const currentBread: BreadcrumbNodeType = { name: post.title, path: router.asPath };
            breadcrumbsContext.addPostBreadcrumbs(currentBread);
        }
    }, [post]);

    const onClickSimilar = () => {
        if (similarPostsPage < similarPostsPageCount) {
            setSimilarPostsPage(similarPostsPage + 1);
        }
    };

    useEffect(() => {
        if (similarPostsPage > 1) {
            const currentPostCategory = post.category
                .filter((element: string) => !post.category.some((other: string) => other.startsWith(element) && other !== element))
                .join(",");

            axios
                .patch(`${process.env.API_BACK}/posts/${post._id}/similars?categories=${currentPostCategory}&page=${similarPostsPage}`)
                .then((responseSim) => {
                    setSimilarPostIds((prevSimilars) => [...prevSimilars, ...responseSim.data.data]);
                })
                .catch((error) => {
                    console.log(error.message || error);
                });
        }
    }, [similarPostsPage]);

    const createBreadcrumbs = () => {
        const baseBread: BreadcrumbNodeType = { name: "Все объявления", path: _paths.adFeed };

        if (breadcrumbsContext.breadcrumbs.main.length === 1 && localStorage) {
            if (!localStorage.getItem("breadcrumbs") || JSON.parse(localStorage.getItem("breadcrumbs")).main.length === 1) {
                breadcrumbsContext.setBreadcrumbs([baseBread]);
            } else {
                if (!JSON.parse(localStorage.getItem("breadcrumbs")).main.some((breadcrumb) => breadcrumb.path === _paths.adFeed)) {
                    breadcrumbsContext.setBreadcrumbs([baseBread]);
                } else {
                    breadcrumbsContext.setBreadcrumbsFromLocalstorage(JSON.parse(localStorage.getItem("breadcrumbs")));
                }
            }
        } else if (!JSON.parse(localStorage.getItem("breadcrumbs")).main.some((breadcrumb) => breadcrumb.path === _paths.adFeed)) {
            breadcrumbsContext.setBreadcrumbs([baseBread]);
        }
    };

    useEffect(() => {
        if (authContext.isLogged) {
            setFavorite(authContext.user?.favorites?.some((favPostId) => favPostId === postId));
        }
    }, [authContext.isLogged]);

    const onClickBook = () => {
        if (!authContext.isLogged && localStorage) {
            localStorage.setItem(
                "post_redirection-login",
                JSON.stringify({ breadcrumbs: localStorage.getItem("breadcrumbs"), postId: postId[0] })
            );
            router.push(_paths.login);
        } else {
            setBookModalOpen(true);
        }
    };

    const maxPayment = 50000;
    const percentage = 0.5;

    const today = new Date();
    const [selectedDay, setSelectedDay] = useState<{
        year: number;
        month: number;
        day: number;
    }>({
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
    });

    const [selectedTime, setSelectedTime] = useState([10, 14]);

    const declensionHours = useDeclension("час", "часа", "часов");

    const onConfirmApplication = () => {
        if (selectedDay && selectedTime) {
            const dateFrom = new Date(selectedDay.year, selectedDay.month - 1, selectedDay.day, selectedTime[0] + 6);
            const dateTill = new Date(selectedDay.year, selectedDay.month - 1, selectedDay.day, selectedTime[1] + 6);

            alert(`${dateFrom.toUTCString()}\n${dateTill.toUTCString()}`);
            setBookModalOpen(false);
            setSuccessModalOpen(true);
        }
    };

    if (loading) return <Loading />;
    return (
        <Layout title={post.title}>
            <div className="wrapper">
                <Modal title="Оформление" openState={isBookModalOpen} toggler={setBookModalOpen} maxContent sidePadding={32}>
                    <div className={styles.modalBody}>
                        <div className={styles.container}>
                            <div className={styles.calendarContainer}>
                                <MyCalendar value={selectedDay} setValue={setSelectedDay} />
                            </div>

                            <div className={styles.sliderContainer}>
                                <h3>Выберите время бронирования:</h3>
                                <MySlider value={selectedTime} setValue={setSelectedTime} />
                                <div className={styles.labels}>
                                    <div className={styles.label}>
                                        От<span>{`${`0${selectedTime[0]}`.slice(-2)}:00`}</span>
                                    </div>
                                    <div className={styles.label}>
                                        До<span>{`${`0${selectedTime[1]}`.slice(-2)}:00`}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.totalInfo}>
                                <div className={styles.firstPart}>
                                    <h2 className={styles.postTitle}>{post.title}</h2>
                                    <p className={styles.info}>
                                        <span>Дата брони: </span>
                                        {`${`0${selectedDay.day}`.slice(-2)}.${`0${selectedDay.month}`.slice(-2)}.${selectedDay.year}`}
                                    </p>
                                    <p className={styles.info}>
                                        <span>Время брони:</span>{" "}
                                        {`${`0${selectedTime[0]}`.slice(-2)}:00 - ${`0${selectedTime[1]}`.slice(-2)}:00`}{" "}
                                        <span className={styles.hoursCount}>({declensionHours(selectedTime[1] - selectedTime[0])})</span>
                                    </p>
                                    <p className={styles.info}>
                                        <span>Общая сумма:</span> {`${post.price.toLocaleString()} `}&#8376; / час
                                        {` X ${selectedTime[1] - selectedTime[0]} = ${(
                                            post.price *
                                            (selectedTime[1] - selectedTime[0])
                                        ).toLocaleString()}`}{" "}
                                        &#8376;
                                    </p>
                                </div>
                                <hr />
                                <div className={styles.total}>
                                    <h2 className={styles.totalPrice}>
                                        К оплате:{" "}
                                        {`${(post.price * (selectedTime[1] - selectedTime[0]) * percentage > maxPayment
                                            ? maxPayment
                                            : post.price * (selectedTime[1] - selectedTime[0]) * percentage
                                        ).toLocaleString()}`}{" "}
                                        &#8376;
                                    </h2>
                                    <h2 className={styles.description}>
                                        {percentage * 100} % от общей суммы
                                        <br />
                                        (не более {maxPayment.toLocaleString()} &#8376;)
                                    </h2>
                                </div>
                            </div>
                        </div>
                        <div className={styles.buttons}>
                            <MyButton primary stretch onClick={onConfirmApplication}>
                                Отправить заявку
                            </MyButton>
                            <MyButton
                                secondary
                                stretch
                                onClick={() => {
                                    setBookModalOpen(false);
                                }}
                            >
                                Отменить
                            </MyButton>
                        </div>
                    </div>
                </Modal>
                <ModalSuccess
                    title="Ваша заявка отправлена!"
                    buttonText="Понятно"
                    openState={isSuccessModalOpen}
                    toggler={setSuccessModalOpen}
                >
                    Не следует, однако забывать, что реализация намеченных плановых заданий требуют от нас анализа системы обучения кадров,
                    соответствует насущным потребностям.
                </ModalSuccess>
                <div className={styles.mainContainer}>
                    <Breadcrumbs />
                    <div className={styles.adInfos}>
                        <div className={styles.leftPart}>
                            <div className={styles.imagesContainer}>
                                {post.images.map((imageUrl, index) => {
                                    if (index > 2) return;
                                    return (
                                        <div
                                            className={`${styles.imageContainer} ${
                                                styles[index === 0 ? "main" : index === 1 ? "second" : index === 2 && "last"]
                                            } ${index === 2 && post.images.length > 3 && styles.showCount}`}
                                            onClick={() => {
                                                onClickImage(index);
                                            }}
                                            key={index}
                                        >
                                            <Image
                                                src={imageUrl}
                                                layout="fill"
                                                objectFit="cover"
                                                placeholder="blur"
                                                blurDataURL="/placeholder-image.jpg"
                                                alt={"Image"}
                                            />
                                            {index === 2 && post.images.length > 3 ? (
                                                <div className={styles.count}>+{post.images.length - 3}</div>
                                            ) : (
                                                <div className={styles.iconContainer}>
                                                    <div className={styles.icon}>
                                                        <Image src="/icons/zoom-in.svg" layout="fill" objectFit="contain" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <AuthorCard author={post.author} />
                        </div>
                        <div className={styles.rightPart}>
                            <h1>{post.title}</h1>
                            <span className={styles.postDate}>
                                {[...post.postDate.slice(0, 10).split("-")].reverse().map((element, index) => {
                                    switch (index) {
                                        case 0: //day
                                            return `${element.startsWith("0") ? element.slice(1) : element} `;
                                        case 1: //month
                                            return `${_monthNames[Number.parseInt(element) - 1].toLowerCase()}, `;
                                        case 2: //year
                                            return `${element} г.`;
                                    }
                                })}
                            </span>
                            <div className={styles.rating}>
                                <RatingStars rating={post.rating?.avg} />
                            </div>
                            <div className={styles.price}>{post.price.toLocaleString()} &#8376; / час</div>
                            <div className={styles.infoContainer}>
                                {post.fields.map((field, index) => (
                                    <div className={styles.info} key={index}>
                                        <div className={styles.icon}>
                                            <Image src={`/icons/fieldIcons/${field.name}.svg`} layout={"fill"} objectFit={"contain"} />
                                        </div>
                                        <span>
                                            {field.name === "area" ? (
                                                <>
                                                    {Number.parseInt(field.info).toLocaleString()} м<sup>2</sup>
                                                </>
                                            ) : field.name === "capacity" ? (
                                                <>до {field.info} людей</>
                                            ) : field.name === "food" ? (
                                                <>{field.info === "true" ? "Разрешено" : field.info === "false" && "Запрещено"}</>
                                            ) : field.name === "sex" ? (
                                                <>{_sexTypes[field.info]}</>
                                            ) : (
                                                <>{field.info}</>
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.descriptionContainer}>
                                {post.description.includes("<br />") ? (
                                    post.description.split("<br />").map((parag, index) => (
                                        <p className={styles.description} key={index}>
                                            {parag}
                                        </p>
                                    ))
                                ) : (
                                    <p className={styles.description}>{post.description}</p>
                                )}
                            </div>
                            <div className={styles.buttons}>
                                <MyButton primary moreRounded onClick={onClickBook}>
                                    Забронировать
                                </MyButton>
                                <MyButton onClick={toggleFavorite}>
                                    <FontAwesomeIcon
                                        icon={isFavorite ? fasHeart : farHeart}
                                        className={`${styles.icon} ${isFavorite && styles.favorite}`}
                                    />
                                    <span className={styles.desktop}>Добавить в избранные</span>
                                    <span className={styles.mobile}>В избранные</span>
                                </MyButton>
                            </div>
                            <AuthorCard author={post.author} isMobile />
                            <div className={styles.mapSection}>
                                <h3>Объявление на карте</h3>
                                <div className={styles.mapContainer}>
                                    <Map random />
                                </div>
                            </div>
                        </div>
                    </div>
                    {isImageModalCarouselActive && (
                        <div className={styles.imageModalCarousel}>
                            <div className={styles.container}>
                                <div className={styles.carousel}>
                                    <AliceCarousel
                                        keyboardNavigation
                                        autoWidth
                                        mouseTracking
                                        touchTracking
                                        disableSlideInfo={false}
                                        activeIndex={clickedImageIndex}
                                        responsive={{
                                            0: {
                                                items: 1,
                                            },
                                        }}
                                        renderSlideInfo={(e) => (
                                            <h1>
                                                {e.item} / {e.itemsCount}
                                            </h1>
                                        )}
                                    >
                                        {post.images.map((imageLink, index) => (
                                            <div key={index} className={styles.imageContainer}>
                                                <Image src={imageLink} layout="fill" objectFit="contain" />
                                            </div>
                                        ))}
                                    </AliceCarousel>
                                </div>
                                <div
                                    className={styles.closeButton}
                                    onClick={() => {
                                        setImageModalCarouselActive(false);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faXmark} />
                                </div>
                                <div
                                    className={styles.shadow}
                                    onClick={() => {
                                        setImageModalCarouselActive(false);
                                    }}
                                />
                                <style>
                                    {`
                                    ${
                                        isImageModalCarouselActive &&
                                        `
                                    body{
                                        overflow: hidden;
                                    }
                                    `
                                    }
                                    .alice-carousel__prev-btn,
                                    .alice-carousel__next-btn{
                                        padding: 0;
                                        position: absolute;
                                        top: 50%;
                                        width: max-content;
                                        transform: translateY(-50%);
                                        font-size: 40px;
                                        font-weight: 600;
                                    }
                                    @media screen and (max-width: 576px){
                                        .alice-carousel__prev-btn,
                                        .alice-carousel__next-btn{
                                            display: none;
                                        }
                                    }
                                    .alice-carousel__prev-btn{
                                        left: 0;
                                    }
                                    .alice-carousel__next-btn{
                                        right: 0;
                                    }
                                    .alice-carousel__prev-btn-item,
                                    .alice-carousel__next-btn-item{
                                        padding: 0;
                                        width: 100px;
                                        height: 200px;
                                        display: flex;
                                        justify-content: center;
                                        align-items:center;
                                        cursor: pointer;
                                        color: rgba(255, 255, 255, 0.3);
                                        background-color: rgba(0, 0, 0, 0.3);
                                        transition: background-color 0.2s, color 0.2s;
                                    }
                                    .alice-carousel__prev-btn-item.__inactive,
                                    .alice-carousel__next-btn-item.__inactive{
                                        display: none;
                                    }
                                    @media screen and (max-width: 768px){
                                        .alice-carousel__prev-btn-item,
                                        .alice-carousel__next-btn-item{
                                            width: 70px;
                                        }
                                    }
                                    .alice-carousel__prev-btn-item:hover,
                                    .alice-carousel__next-btn-item:hover{
                                        color: rgba(255, 255, 255, 1);
                                        background-color: rgba(0, 0, 0, 0.6);
                                    }
                                    .alice-carousel__dots{
                                        margin: 10px 0;
                                    }
                                    .alice-carousel__dots-item:not(.__custom){
                                        width: 10px;
                                        height: 10px;
                                        background-color: #fff;
                                        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
                                    }
                                    .alice-carousel__dots-item:not(.__custom):hover,
                                    .alice-carousel__dots-item:not(.__custom).__active{
                                        background-color: #fc4f4f;
                                    }
                                    .alice-carousel__slide-info{
                                        top: 30px;
                                        right: unset;
                                        left: 50%;
                                        font-size: 16px;
                                        transform: translateX(-50%);
                                        color: #18191f;
                                        background-color: #fff;
                                        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
                                    }
                                `}
                                </style>
                            </div>
                        </div>
                    )}
                </div>
                <SectionContainer>
                    <h2 className={styles.sectionTitle}>Отзывы клиентов</h2>
                    <ReviewRating rating={post.rating} />
                    <div className={styles.commentsContainer}>
                        {post.reviews.length > 0 ? (
                            <>
                                <AliceCarousel autoWidth mouseTracking disableDotsControls disableButtonsControls>
                                    {post.reviews.map((comment) => (
                                        <CommentCard {...comment} key={comment.id} />
                                    ))}
                                </AliceCarousel>
                            </>
                        ) : (
                            <h4 className={styles.notFound}>У объявления еще нет отзывов.</h4>
                        )}
                    </div>
                </SectionContainer>
                <SectionContainer>
                    <h2 className={styles.sectionTitle}>Похожие объявления</h2>
                    {similarPosts && similarPosts.length > 0 ? (
                        <div className={styles.similarAdsContainer}>
                            <div className={styles.similarAds}>
                                {similarPosts.map((similarPost) => (
                                    <AdCardItem post={similarPost} key={similarPost._id} isGrid />
                                ))}
                            </div>
                            {similarPostsPage !== similarPostsPageCount && (
                                <button className={styles.loadMoreButton} onClick={onClickSimilar}>
                                    Показать еще
                                </button>
                            )}
                        </div>
                    ) : (
                        <h4 className={styles.notFound}>Похожих объявлений не найдено.</h4>
                    )}
                </SectionContainer>
            </div>
            <style>
                {`${
                    isBookModalOpen &&
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
