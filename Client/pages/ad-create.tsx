import { faTrashCan, faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import NumberFormat from "react-number-format";
import { CategorySelect } from "../components/CategorySelect";
import Layout from "../components/Layout";
import { Loading } from "../components/LoadingWindow";
import { Map } from "../components/Map";
import { Breadcrumbs } from "../components/UI/Breadcrumbs";
import { MyButton } from "../components/UI/MyButton";
import { Select } from "../components/UI/Select";
import { useAuthContext } from "../context/auth";
import { useBreadcrumbsContext } from "../context/breadcrumbs";
import { useStaticDataContext } from "../context/staticData";
import _categories from "../data/categories";
import { _contacts, _socials } from "../data/infos";
import _paths from "../data/paths";
import { BreadcrumbNodeType, ContactType, OptionType, SocialType, UpCategoryNavType } from "../interfaces";
import styles from "../styles/AdCreate.module.scss";

interface AdCreateProps {
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

interface PageSectionProps {
    sectionNumber: number;
    children: ReactNode;
}

const PageSection = ({ sectionNumber, children }: PageSectionProps) => {
    return (
        <div>
            <h2 className={styles.sectionTitle}>Шаг {sectionNumber}</h2>
            <div className={styles.sectionBody}>{children}</div>
        </div>
    );
};

export default function AdCreate({ categories, socials, contacts }: AdCreateProps) {
    const breadcrumbsContext = useBreadcrumbsContext();
    const staticData = useStaticDataContext();
    const [loading, setLoading] = useState(true);
    const authContext = useAuthContext();
    const router = useRouter();
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    if (!authContext.isLogged || authContext.role !== "Author") {
        (async () => {
            await router.push(_paths.main);
        })();
    }

    const pageName = "Добавить объявление";

    const breadcrumbs: BreadcrumbNodeType[] = [
        { name: "Личный кабинет", path: _paths.profile },
        { name: pageName, path: router.pathname },
    ];

    const [isCompleted, setCompleted] = useState(false);

    useEffect(() => {
        staticData.setDatas({
            categories: categories || staticData.get.categories || _categories,
            socials: socials || staticData.get.socials || _socials,
            contacts: contacts || staticData.get.contacts || _contacts,
        });

        breadcrumbsContext.setBreadcrumbs(breadcrumbs);
        if (authContext.isLogged && authContext.role === "Author") setLoading(false);
    }, []);

    const [selectedCategory, setSelectedCategory] = useState<UpCategoryNavType>(categories[0]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const inputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (event.type === "dragenter" || event.type === "dragover") {
            setDragActive(true);
        } else if (event.type === "dragleave") {
            setDragActive(false);
        }
    };

    const [imagePreviews, setImagePreviews] = useState<any[]>(null);

    const handleFileInputChange = (event) => {
        event.preventDefault();

        const imagesCount = event.target.files.length;

        const megabyteLimit = 3;

        let tempFiles = [];
        for (let i = 0; i < imagesCount; i++) {
            let isLarge = false;
            if (event.target.files[i].size > megabyteLimit * 1024 * 1024) {
                isLarge = true;
                alert("Изображение превышает лимит загрузки по памяти (3Mb)");
            }
            tempFiles.push({
                name: event.target.files[i].name,
                url: URL.createObjectURL(event.target.files[i]),
                isLarge: isLarge,
                file: JSON.stringify(event.target.files[i]),
            });
        }
        setImagePreviews((prevImagePreviews) => {
            if (prevImagePreviews) return [...prevImagePreviews, ...tempFiles];
            return [...tempFiles];
        });
    };

    const onButtonClick = () => {
        inputRef.current.click();
    };

    const onDeleteImage = (targetImage) => {
        setImagePreviews((prevImagePreviews) => prevImagePreviews.filter((prevImagePreview) => prevImagePreview !== targetImage));
    };

    const cityList: OptionType[] = [
        { title: "Алматы", value: "Алматы" },
        { title: "Нур-Султан", value: "Нур-Султан" },
        { title: "Актау", value: "Актау" },
        { title: "Атырау", value: "Атырау" },
        { title: "Жезказган", value: "Жезказган" },
        { title: "Кокшетау", value: "Кокшетау" },
        { title: "Павлодар", value: "Павлодар" },
        { title: "Мерке", value: "Мерке" },
    ];

    const [selectedCity, setCity] = useState(cityList[0].value);

    if (loading) return <Loading />;
    return (
        <Layout title={pageName}>
            {!isCompleted ? (
                <div className="wrapper">
                    <div className={styles.mainContainer}>
                        <Breadcrumbs />
                        <div className={styles.container}>
                            <h1>{pageName}</h1>
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                }}
                                className={styles.sectionsContainer}
                            >
                                <PageSection sectionNumber={1}>
                                    <div className={styles.formContainer}>
                                        <h3 className={styles.formTitle}>Заголовок объявления</h3>
                                        <div className={styles.form}>
                                            <input type="text" {...register("title", { required: true })} />
                                            <div className={styles.hint}>
                                                <h3>Подсказка</h3>
                                                <p>
                                                    Равным образом сложившаяся структура организации проверки влечёт за собой интересный
                                                    процесс внедрения модернизации укрепления демократической системы.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.formContainer}>
                                        <h3 className={styles.formTitle}>Добавить фотографии (минимум 3)</h3>
                                        <div className={`${styles.form} ${styles.fileInput}`} onDragEnter={handleDrag}>
                                            <input
                                                type="file"
                                                className={styles.inputFileUpload}
                                                {...register("images", { required: true })}
                                                multiple
                                                ref={inputRef}
                                                onChange={handleFileInputChange}
                                            />
                                            <label className={`${styles.labelFileUpload} ${dragActive ? styles.dragActive : ""}`}>
                                                <div>
                                                    <button className={styles.uploadButton} onClick={onButtonClick}>
                                                        <FontAwesomeIcon icon={faArrowUpFromBracket} className={styles.icon} /> Выберите
                                                        изображение
                                                    </button>
                                                    <p>Перетащите изображение сюда</p>
                                                </div>
                                            </label>
                                        </div>
                                        {imagePreviews && (
                                            <div className={styles.imagesContainer}>
                                                {imagePreviews.map((image, index) => (
                                                    <div
                                                        className={`${styles.imageNode} ${image.isLarge && styles.isLarge}`}
                                                        key={image.url}
                                                    >
                                                        <span className={styles.counter}>
                                                            {image.isLarge && (
                                                                <FontAwesomeIcon icon={faXmarkCircle} className={styles.xMark} />
                                                            )}{" "}
                                                            {index + 1}
                                                        </span>
                                                        <div className={styles.body}>
                                                            <div className={styles.image}>
                                                                <Image
                                                                    src={image.url}
                                                                    layout={"fill"}
                                                                    objectFit={"cover"}
                                                                    alt={"Image preview"}
                                                                />
                                                            </div>
                                                            <h4 className={styles.title}>{image.name}</h4>

                                                            <FontAwesomeIcon
                                                                icon={faTrashCan}
                                                                className={styles.deleteButton}
                                                                onClick={() => {
                                                                    onDeleteImage(image);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </PageSection>
                                <PageSection sectionNumber={2}>
                                    <div className={styles.formContainer}>
                                        <h3 className={styles.formTitle}>Выберите категорию</h3>
                                        <div className={styles.form}>
                                            <CategorySelect
                                                categories={staticData.get.categories}
                                                hangleCategoryChange={setSelectedCategory}
                                                categoriesValue={selectedCategories}
                                                setCategoriesValue={setSelectedCategories}
                                            />
                                            <div className={styles.hint}>
                                                <h3>Подсказка</h3>
                                                <p>
                                                    Равным образом сложившаяся структура организации проверки влечёт за собой интересный
                                                    процесс внедрения модернизации укрепления демократической системы.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.formContainer}>
                                        <h3 className={styles.formTitle}>Установите цену за час</h3>
                                        <div className={styles.form}>
                                            <Controller
                                                {...{
                                                    control,
                                                    register,
                                                    name: "price",
                                                    rules: {
                                                        required: true,
                                                    },
                                                    render: ({ field }) => <NumberFormat {...field} />,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.formContainer}>
                                        <h3 className={styles.formTitle}>Описание</h3>
                                        <div className={styles.form}>
                                            <textarea
                                                {...register("description", {
                                                    required: true,
                                                })}
                                            ></textarea>
                                            <div className={styles.hint}>
                                                <h3>Подсказка</h3>
                                                <p>
                                                    Равным образом сложившаяся структура организации проверки влечёт за собой интересный
                                                    процесс внедрения модернизации укрепления демократической системы.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {selectedCategory.path === "rooms" ? (
                                        <div className={styles.fieldsContainer}>
                                            <div className={styles.formContainer}>
                                                <h3 className={styles.formTitle}>
                                                    Площадь (м<sup>2</sup>)
                                                </h3>
                                                <div className={styles.form}>
                                                    <Controller
                                                        {...{
                                                            control,
                                                            register,
                                                            name: "area",
                                                            rules: {
                                                                required: true,
                                                            },
                                                            render: ({ field }) => <NumberFormat {...field} />,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className={styles.formContainer}>
                                                <h3 className={styles.formTitle}>Вместимость</h3>
                                                <div className={styles.form}>
                                                    <Controller
                                                        {...{
                                                            control,
                                                            register,
                                                            name: "capacity",
                                                            rules: {
                                                                required: true,
                                                            },
                                                            render: ({ field }) => <NumberFormat {...field} />,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : selectedCategory.path === "clothes" ? (
                                        <div className={styles.fieldsContainer}>
                                            <div className={styles.formContainer}>
                                                <h3 className={styles.formTitle}>Размер</h3>
                                                <div className={styles.form}>
                                                    <Controller
                                                        {...{
                                                            control,
                                                            register,
                                                            name: "size",
                                                            rules: {
                                                                required: true,
                                                            },
                                                            render: ({ field }) => <NumberFormat {...field} />,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}

                                    {selectedCategory.path === "rooms" ? (
                                        <div className={styles.formContainer}>
                                            <h3 className={styles.formTitle}>Еда с собой</h3>
                                            <div className={styles.radiosContainer}>
                                                <label className={styles.radio}>
                                                    <input
                                                        type="radio"
                                                        {...register("food", { required: false })}
                                                        name="food"
                                                        value="true"
                                                    />
                                                    Разрешена
                                                </label>
                                                <label className={styles.radio}>
                                                    <input
                                                        type="radio"
                                                        {...register("food", { required: false })}
                                                        name="food"
                                                        value="false"
                                                    />
                                                    Запрещена
                                                </label>
                                            </div>
                                        </div>
                                    ) : selectedCategory.path === "clothes" ? (
                                        <div className={styles.formContainer}>
                                            <h3 className={styles.formTitle}>Пол</h3>
                                            <div className={styles.radiosContainer}>
                                                <label className={styles.radio}>
                                                    <input type="radio" {...register("sex", { required: false })} name="sex" value="true" />
                                                    Мужской
                                                </label>
                                                <label className={styles.radio}>
                                                    <input
                                                        type="radio"
                                                        {...register("sex", { required: false })}
                                                        name="sex"
                                                        value="false"
                                                    />
                                                    Женский
                                                </label>
                                                <label className={styles.radio}>
                                                    <input
                                                        type="radio"
                                                        {...register("sex", { required: false })}
                                                        name="sex"
                                                        value="false"
                                                    />
                                                    Унисекс
                                                </label>
                                            </div>
                                        </div>
                                    ) : null}
                                </PageSection>
                                <PageSection sectionNumber={3}>
                                    <div className={styles.formContainer}>
                                        <h3 className={styles.formTitle}>Город</h3>
                                        <div className={styles.form}>
                                            <Select stretch big options={cityList} callback={setCity} />
                                        </div>
                                    </div>
                                    <div className={styles.formContainer}>
                                        <h3 className={styles.formTitle}>Укажите адрес передачи товара</h3>
                                        <div className={styles.form}>
                                            <input type="text" {...register("title", { required: true })} />
                                        </div>
                                    </div>
                                    <div className={styles.mapContainer}>
                                        <Map random marker />
                                    </div>
                                    <div className={styles.buttons}>
                                        <MyButton
                                            primary
                                            stretch
                                            onClick={() => {
                                                router.push(router.asPath);
                                                setCompleted(true);
                                            }}
                                        >
                                            Опубликовать объявление
                                        </MyButton>
                                        <MyButton
                                            secondary
                                            stretch
                                            onClick={() => {
                                                router.push(_paths.profileAds);
                                            }}
                                        >
                                            Вернуться назад
                                        </MyButton>
                                    </div>
                                </PageSection>
                            </form>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.successPage}>
                    <h1>Спасибо за публикацию!</h1>
                    <h3>Ваша объявление скоро появится на сайте.</h3>
                    <div className={styles.imageContainer}>
                        <Image src={"/illustrations/rocket.svg"} layout={"fill"} objectFit={"contain"} alt={"Rocket"} />
                    </div>
                    <div className={styles.buttonContainer}>
                        <MyButton
                            primary
                            stretch
                            onClick={() => {
                                router.push(_paths.main);
                            }}
                        >
                            Вернуться на главную страницу
                        </MyButton>
                    </div>
                </div>
            )}
        </Layout>
    );
}
