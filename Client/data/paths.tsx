interface PathsType {
    readonly [key: string]: string;
}

const _paths: PathsType = {
    main: "/",
    adFeed: "/ad-feed",
    login: "/auth",
    signup: "/auth/signup",
    registerPartner: "/auth/partner",
    resetPassword: "/auth/resetPassword",
    partnerRules: "/partnerRules",
    aboutUs: "/about",
    contacts: "/contacts",
    contactWithUs: "/contacts/#contactWithUs",
    howItWorks: "/#instruction",
    advantages: "/#advantages",
    faq: "/#faq",
    profile: "/profile",
    profileAds: "/profile/ads",
    profileFavorites: "/profile/favorites",
    favorites: "/favorites",
    post: "/post",
    admin: "/admin",
    adCreate: "/ad-create",
};

export default _paths;
