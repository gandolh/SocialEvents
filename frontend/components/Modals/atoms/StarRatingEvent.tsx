'use client'
import { FaStar, FaRegCircleXmark } from "react-icons/fa6";
import styles from "@/styles/StarRatingEvent.module.css";
import React from "react";
import { Rating } from "@/types/Rating";
import { useSession } from 'next-auth/react';
import { createRating, deleteRating, doRating, getRating } from "@/components/utils/ApiCallers/ServerApiCallers";


// Rating - eventid or user email
type StarRatingEventProps = {
    eventId?: string,
    hostId?: string,
}
const StarRatingEvent = ({ eventId, hostId }: StarRatingEventProps) => {
    const [starCount, setStarCount] = React.useState<number>(0);
    const [avgStarRating, setAvgStarRating] = React.useState<number>(0);
    const [Rating, setRating] = React.useState<Rating>();
    const { data: session } = useSession();
    const ratingId = eventId ?? hostId;
    const fetchRating = async () => {
        getRating(ratingId).then((res) => {
            if (session?.user?.email === null)
                return null;
            else if(res.rating === null){
                createRating(ratingId).then(() => fetchRating());
                return null;
            }
            const myRating = res.rating.ratings.find(el => el.email === session?.user?.email);
            
            let avgRating = 0;
            if(res.rating.ratings.length > 0) 
                avgRating = res.rating.ratings.reduce((acc, curr) => acc + curr.rating, 0) / res.rating.ratings.length;

            setRating(res.rating);
            setAvgStarRating(avgRating);
            if (myRating === undefined)
                return setStarCount(0);
            else setStarCount(myRating.rating);
        });

    }

    React.useEffect(() => {
        fetchRating();
    }, []);


    const handleRemoveRating = () => {
        const email = session?.user?.email ?? "";
        deleteRating(ratingId, email).then(() => fetchRating());
    }

    const handleChangeRating = (rating: number) => {
        const email = session?.user?.email ?? "";
       doRating(ratingId, email, rating).then(() => fetchRating());

    }

    return (
        // is right to left
        <div className={styles.ratting__star__wrapper}>
            {Rating &&
                <>
                    <span className={styles.star__count}> Total: {avgStarRating}/5  </span>
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
                </>
            }
        </div>

    );
}

export default StarRatingEvent;