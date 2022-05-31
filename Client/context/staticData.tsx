import { createContext, useContext } from "react";
import { UpCategoryNavType, ContactType, SocialType } from "../interfaces";

export interface StaticContextType {
    get: {
        categories?: UpCategoryNavType[];
        socials?: SocialType[];
        contacts?: ContactType;
    };
    setDatas: ({}: StaticContextType["get"]) => void;
}

const StaticDataContext = createContext(null);

export default StaticDataContext;

export function useStaticDataContext(): StaticContextType {
    return useContext(StaticDataContext);
}
