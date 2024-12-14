// hooks/useFirestore.js
import { useState, useCallback } from 'react';
import { collection, query, where, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useFirestore = (collectionName, queryConstraints = [], pageSize = 10) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const loadData = useCallback(async (isLoadingMore = false) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let q = query(
        collection(db, collectionName),
        ...queryConstraints,
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );

      if (isLoadingMore && lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setItems(prevItems => isLoadingMore ? [...prevItems, ...docs] : docs);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(docs.length === pageSize);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [collectionName, queryConstraints, pageSize, lastDoc]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadData(true);
    }
  }, [hasMore, loading, loadData]);

  return {
    items,
    loading,
    error,
    hasMore,
    loadData,
    loadMore,
  };
};