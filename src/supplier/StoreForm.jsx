import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function StoreForm({ onStoreCreated }) {
  const [store, setStore] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [storeExists, setStoreExists] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) checkExistingStore();
  }, [user]);

  const checkExistingStore = async () => {
    try {
      const docRef = doc(db, "stores", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setStoreExists(true);
        setStore(docSnap.data());
      }
    } catch (err) {
      console.error("Failed to check store:", err);
    }
  };

  const handleChange = (e) => {
    setStore({ ...store, [e.target.name]: e.target.value });
  };

  const handleCreateStore = async () => {
  if (!user) {
    setError("User not authenticated.");
    return;
  }

  if (!store.name.trim() || !store.description.trim()) {
    setError("Store name and description are required.");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const docRef = doc(db, "stores", user.uid);
    const storeData = {
      name: store.name.trim(),
      description: store.description.trim(),
      image: store.image?.trim() || null,
      createdAt: serverTimestamp(),
      supplierId: user.uid,
    };

    console.log("Saving to Firestore:", storeData);

    await setDoc(docRef, storeData);
    setStoreExists(true);
    onStoreCreated?.(); // Trigger callback
  } catch (err) {
    console.error("Error creating store:", err);
    setError("❌ Failed to create store. Check console for details.");
  }

  setLoading(false);
};


  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-emerald-700">
        {storeExists ? "Your Store" : "Create Your Store"}
      </h2>

      {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

      <div className="space-y-4">
        <input
          type="text"
          name="name"
          disabled={storeExists}
          placeholder="Store Name"
          className="w-full p-2 border rounded bg-slate-50"
          value={store.name}
          onChange={handleChange}
        />
        <textarea
          name="description"
          disabled={storeExists}
          placeholder="Store Description"
          className="w-full p-2 border rounded bg-slate-50"
          value={store.description}
          onChange={handleChange}
          rows={3}
        />
        <input
          type="url"
          name="image"
          disabled={storeExists}
          placeholder="Store Banner Image URL (optional)"
          className="w-full p-2 border rounded bg-slate-50"
          value={store.image || ""}
          onChange={handleChange}
        />
      </div>

      {!storeExists && (
        <button
          onClick={handleCreateStore}
          disabled={loading}
          className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded transition w-full sm:w-auto"
        >
          {loading ? "Creating..." : "🏪 Create Store"}
        </button>
      )}
    </div>
  );
}
