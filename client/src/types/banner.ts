type BannerTheme = "primary" | "secondary" | "classic";

interface BannerData {
    id: string;
    title: string;
    description: string;
    image: string;
    theme: BannerTheme;
    isActive: boolean;
    link?: string;
    createdAt: Date;
}

// Get Banners

interface GetBannersResponse {
    success: boolean;
    data: BannerData[];
    message: string;
}

export type { BannerData, BannerTheme, GetBannersResponse };