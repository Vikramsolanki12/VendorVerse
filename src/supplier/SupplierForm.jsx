import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export default function SupplierForm({ onProfileCreated }) {
  const [supplier, setSupplier] = useState({
    name: "",
    contact: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [error, setError] = useState("");

  const user = auth.currentUser;

  useEffect(() => {
    if (user) checkExistingProfile();
  }, [user]);

  const checkExistingProfile = async () => {
    try {
      const docRef = doc(db, "suppliers", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfileExists(true);
        setSupplier(docSnap.data());
      }
    } catch (err) {
      console.error("Failed to check profile:", err);
    }
  };

  const handleChange = (e) => {
    setSupplier({ ...supplier, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { name, contact, location } = supplier;
    if (!name || !contact || !location) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await setDoc(doc(db, "suppliers", user.uid), {
        ...supplier,
        createdAt: serverTimestamp(),
        uid: user.uid,
        email: user.email,
      });

      setProfileExists(true);
      onProfileCreated && onProfileCreated(); // optional callback
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-emerald-700">
        {profileExists ? "Your Profile" : "Create Supplier Profile"}
      </h2>

      {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          disabled={profileExists}
          placeholder="Full Name"
          className="p-2 border rounded bg-slate-50"
          value={supplier.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="contact"
          disabled={profileExists}
          placeholder="Contact Number"
          className="p-2 border rounded bg-slate-50"
          value={supplier.contact}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          disabled={profileExists}
          placeholder="City or Area"
          className="p-2 border rounded bg-slate-50 col-span-1 sm:col-span-2"
          value={supplier.location}
          onChange={handleChange}
        />
      </div>

      {!profileExists && (
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded transition"
        >
          {loading ? "Saving..." : "✅ Save Profile"}
        </button>
      )}
    </div>
  );
}
