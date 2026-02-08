import { AuthorBookResponseDto } from "./books";

interface AuthorData {
    id: string;
    name: string;
    profileImage?: string;
}

interface AuthorDetailedData extends AuthorData {
    bio: string;
    website: string;
    isFeatured: boolean;
    createdAt: string;
}

// Get All Authors
interface GetAllAuthorsResponse {
    success: boolean;
    data: AuthorData[];
    message: string;
}

// Get Featured Authors
interface GetFeaturedAuthorsResponse {
    success: boolean;
    data: AuthorData[];
    message: string;
}

// Get Single Author
interface AuthorDetailsDto {
  author: AuthorDetailedData;
  books: AuthorBookResponseDto[];
}
interface GetAuthorDetailsResponse {
    success: boolean;
    data: AuthorDetailsDto;
    message: string;
}

interface GetSingleAuthorArgs {
    id: string;
}

export type {
    AuthorData,
    AuthorDetailedData,
    GetAllAuthorsResponse,
    GetFeaturedAuthorsResponse,
    GetAuthorDetailsResponse,
    GetSingleAuthorArgs,
};