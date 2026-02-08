interface CategoryData {
    id: string;
    name: string;
    icon: string;
    createdAt: Date;
}

// Get Categories
interface GetCategoriesResponse {
    success: boolean;
    data: CategoryData[];
    message: string;
}

export type { CategoryData, GetCategoriesResponse };