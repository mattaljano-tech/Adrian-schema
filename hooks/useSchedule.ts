import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

const useSchedule = () => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSchedule = async () => {
            setLoading(true);
            try {
                const db = firebase.firestore();
                const scheduleCollection = await db.collection('schedule').get();
                const scheduleData = scheduleCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setSchedule(scheduleData);
                setError(null);
            } catch (err) {
                setError(err.message);
                setSchedule([]);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, []);

    return { schedule, loading, error };
};

export default useSchedule;