import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { RatingStars } from "../UI/RatingStars";
import styles from "./AdCardItem.module.scss";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthContext } from "../../context/auth";
import _paths from "../../data/paths";
import { AdCardType } from "../../interfaces";
import axios from "axios";
import { _sexTypes } from "../../data";

type AdCardItemProps = {
    post: AdCardType;
    isFavCardItem?: boolean;
    isGrid?: boolean;
};

const AdCardItem = ({ post, isGrid, isFavCardItem }: AdCardItemProps) => {
    if (!post) return null;

    const authContext = useAuthContext();

    const [isFavorite, setFavorite] = useState(isFavCardItem || false);

    const toggleFavorite = (event) => {
        event.preventDefault();

        if (authContext.isLogged) {
            try {
                axios
                    .patch(`${process.env.API_BACK}/posts/${post._id}/addToFavorites`, null, {
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
                        JSON.stringify([...JSON.parse(localStorage.getItem("favorites"))].filter((favPostId) => favPostId !== post._id))
                    );
                } else {
                    //add to favorites
                    if (localStorage.getItem("favorites")) {
                        localStorage.setItem("favorites", JSON.stringify([...JSON.parse(localStorage.getItem("favorites")), post._id]));
                    } else {
                        localStorage.setItem("favorites", JSON.stringify([post._id]));
                    }
                }
            }
        }
        setFavorite(!isFavorite);
    };

    useEffect(() => {
        {
            if (authContext.isLogged) {
                setFavorite(authContext.user.favorites?.some((favPostId) => favPostId === post._id));
            } else {
                if (localStorage && localStorage.getItem("favorites")) {
                    setFavorite([...JSON.parse(localStorage.getItem("favorites"))].some((favPostId) => favPostId === post._id));
                }
            }
        }
    }, []);
    return (
        <Link href={`${_paths.post}/${post._id}`}>
            <a className={`${styles.cardContainer} ${isGrid ? styles.grid : styles.row} ${isFavCardItem && styles.isFavCardItem}`}>
                <div className={styles.imageContainer}>
                    <Image
                        className={styles.image}
                        layout="fill"
                        objectFit="cover"
                        src={post.previewImage}
                        placeholder="blur"
                        blurDataURL="/placeholder-image.jpg"
                        alt={"Preview Image"}
                    />
                </div>
                <div className={styles.contentContainer}>
                    <h3 className={styles.title}>{post.title}</h3>
                    <div className={styles.rating}>
                        <RatingStars rating={post.rating.avg} isGrid={isGrid} />
                    </div>
                    <div className={styles.price}>{post.price.toLocaleString()} &#8376; / час</div>
                    <div className={styles.infoContainer}>
                        {post.fields.some((field) => field.name === "area") ? (
                            <>
                                <div className={styles.info}>
                                    <div className={styles.icon}>
                                        <Image src={`/icons/fieldIcons/area.svg`} layout={"fill"} objectFit={"contain"} alt={"Area"} />
                                    </div>
                                    <span>
                                        {Number.parseInt(post.fields.find((field) => field.name === "area").info).toLocaleString()} м
                                        <sup>2</sup>
                                    </span>
                                </div>
                                <div className={styles.info}>
                                    <div className={styles.icon}>
                                        <Image
                                            src={`/icons/fieldIcons/capacity.svg`}
                                            layout={"fill"}
                                            objectFit={"contain"}
                                            alt={"Capacity"}
                                        />
                                    </div>
                                    <span>до {post.fields.find((field) => field.name === "capacity").info} людей</span>
                                </div>
                                {!isGrid && (
                                    <div className={styles.info}>
                                        <div className={styles.icon}>
                                            <Image
                                                src={`/icons/fieldIcons/address.svg`}
                                                layout={"fill"}
                                                objectFit={"contain"}
                                                alt={"Address"}
                                            />
                                        </div>
                                        <span>{post.fields.find((field) => field.name === "address").info}</span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                {post.fields.some((field) => field.name === "sex") && (
                                    <div className={styles.info}>
                                        <div className={styles.icon}>
                                            <Image src={`/icons/fieldIcons/sex.svg`} layout={"fill"} objectFit={"contain"} alt={"Sex"} />
                                        </div>
                                        <span>{_sexTypes[post.fields.find((field) => field.name === "sex").info]}</span>
                                    </div>
                                )}
                                <div className={styles.info}>
                                    <div className={styles.icon}>
                                        <Image
                                            src={`/icons/fieldIcons/address.svg`}
                                            layout={"fill"}
                                            objectFit={"contain"}
                                            alt={"Address"}
                                        />
                                    </div>
                                    <span>{post.fields.find((field) => field.name === "address").info}</span>
                                </div>
                            </>
                        )}
                    </div>
                    {!isGrid && (
                        <div className={styles.description}>
                            <p>{post.description}</p>
                        </div>
                    )}
                </div>
                <div className={`${styles.addFavorite} ${isFavorite && styles.favorite}`} onClick={toggleFavorite}>
                    <FontAwesomeIcon icon={isFavorite ? fasHeart : farHeart} />
                </div>
            </a>
        </Link>
    );
};

export { AdCardItem };
