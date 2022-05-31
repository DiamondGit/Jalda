import { createContext, useContext } from "react";
import { BreadcrumbNodeType } from "../interfaces";

export interface Breadcrumbs {
    main: BreadcrumbNodeType[];
    search: BreadcrumbNodeType;
    post: BreadcrumbNodeType;
}

export interface BreadcrumbsContext_I {
    breadcrumbs: Breadcrumbs;
    setBreadcrumbs(breadcrumbs: BreadcrumbNodeType[]): void;
    setBreadcrumbsFromLocalstorage(breadcrumbs: Breadcrumbs): void;
    addBreadcrumbs(breadcrumbs: BreadcrumbNodeType): void;
    addSearchBreadcrumbs(bread: BreadcrumbNodeType): void;
    deleteSearchBreadcrumbs(): void;
    addPostBreadcrumbs(bread: BreadcrumbNodeType): void;
    deletePostBreadcrumbs(): void;
}

const BreadcrumbsContext = createContext(null);

export default BreadcrumbsContext;

export function useBreadcrumbsContext(): BreadcrumbsContext_I {
    return useContext(BreadcrumbsContext);
}
