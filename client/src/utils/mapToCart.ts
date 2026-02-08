interface MapToCartResponse {
    id: string;
    title: string;
    sellingPrice: number;
    stock: number;
    coverImage: string;
}

export function mapToCart(data: any): MapToCartResponse {
    return {
        id: data.id,
        title: data.title,
        sellingPrice: data.sellingPrice,
        stock: data.stock,
        coverImage: data.coverImage
    }
};