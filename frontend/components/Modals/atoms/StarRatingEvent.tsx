'use client'
import { FaStar, FaRegCircleXmark } from "react-icons/fa6";
import styles from "@/styles/StarRatingEvent.module.css";
import React from "react";
import { Rating } from "@/types/Rating";
import { useSession } from 'next-auth/react';


// Rating - eventid or user email
type StarRatingEventProps = {
    eventId?: string,
    hostId?: string,
}
const StarRatingEvent = ({ eventId, hostId }: StarRatingEventProps) => {
    const [starCount, setStarCount] = React.useState<number>(0);
    const [Rating, setRating] = React.useState<Rating>({} as Rating);
    const { data: session } = useSession();
    const ratingId = eventId ?? hostId;
    const fetchRating = async () => {
        // getRating(ratingId).then((res) => {
        //     setRating(res.rating);
        //     setStarCount(res.rating?.ratingDict?.[session?.user?.email] ?? 0);
        // });
    }

    React.useEffect(() => {
        fetchRating();
    }, []);


    const handleRemoveRating = () => {
        // delete Rating.ratingDict[session?.user?.email];
        // updateRating(ratingId, Rating.ratingDict).then(() => fetchRating());
        // setStarCount(0);
    }

    const handleChangeRating = (rating: number) => {
        // if(Rating === undefined || Rating === null){
        //     addRating(ratingId, {[session?.user?.email] : rating}).then(() => fetchRating());
        //     return;
        // }

        // if (Rating.ratingDict === undefined
        //     || Rating.ratingDict === null
        //     || Rating.ratingDict[ratingId] === undefined
        //     || Rating.ratingDict[ratingId] === null) {
        //     const ratingDict = Rating.ratingDict ?? {};
        //     ratingDict[session?.user?.email] = rating;
        //     updateRating(ratingId, ratingDict).then(() => fetchRating());
        // }
        // else {
        //     Rating.ratingDict[session?.user?.email] = rating;
        //     updateRating(ratingId, Rating.ratingDict).then(() => fetchRating());
        // }
        // setStarCount(rating);

    }

    return (
        // is right to left
        <div className={styles.ratting__star__wrapper}>

            <span className={styles.star__count}> Total: {Rating?.rating ?? 0}/5  </span>
            <FaRegCircleXmark className={styles.XMark} onClick={handleRemoveRating} />
            <div className={styles.star__wrapper}>
                <FaStar className={styles.star + ' ' + styles.s1 + ' ' + (5 - starCount < 1 ? styles.selected : '')}
                    onClick={() => handleChangeRating(5)}
                />
                <FaStar className={styles.star + ' ' + styles.s2 + ' ' + (5 - starCount < 2 ? styles.selected : '')}
                    onClick={() => handleChangeRating(4)}
                />
                <FaStar className={styles.star + ' ' + styles.s3 + ' ' + (5 - starCount < 3 ? styles.selected : '')}
                    onClick={() => handleChangeRating(3)}
                />
                <FaStar className={styles.star + ' ' + styles.s4 + ' ' + (5 - starCount < 4 ? styles.selected : '')}
                    onClick={() => handleChangeRating(2)}
                />
                <FaStar className={styles.star + ' ' + styles.s5 + ' ' + (5 - starCount < 5 ? styles.selected : '')}
                    onClick={() => handleChangeRating(1)}
                />
            </div>
        </div>

    );
}

export default StarRatingEvent;