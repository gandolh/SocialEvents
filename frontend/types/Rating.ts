type UserRating = {
    email: string,
    rating : number
}

export type Rating = {
    _id?: string,
    ratingID: string,
    ratings: UserRating[]
};