/**
 * ============================================================================
 * 1. FIRESTORE & STORAGE SCHEMA DESIGN
 * ============================================================================
 * 
 * --- COLLECTION: 'bookings' ---
 * Document Fields:
 * - bookingId (string): Generated automatically by Firestore document reference.
 * - clientId (string): Unique identifier of the requesting client (User).
 * - professionalId (string | null): Unique identifier of the professional (Expert) who accepted the job. Null when pending.
 * - serviceType (string): The requested category type (e.g. 'cleaner', 'electrician', 'painter', 'plumber', 'tailor').
 * - scheduledSlot (object):
 *     - date (string): 'YYYY-MM-DD' formatted date.
 *     - day (string): e.g. 'Saturday', 'Monday'.
 *     - time (string): 'HH:MM - HH:MM' arrival time.
 * - notes (string): Text note / detailed description of the client's problem.
 * - problemImageURL (string | null): Public download URL of the uploaded image in Firebase Storage.
 * - location (object):
 *     - lat (number): Latitude coordinate.
 *     - lng (number): Longitude coordinate.
 * - status (string): Active state indicator ('pending' | 'accepted' | 'rejected' | 'completed').
 * - totalEstimate (string): Estimated payment value (e.g., '₹1,149').
 * - createdAt (Timestamp): Firestore server side timestamp.
 * 
 * --- STORAGE DIRECTORY SCHEMA ---
 * Structured path: 'bookings/{userId}/{timestamp}.jpg'
 * - Organizes uploads by client ID to secure access rules.
 */

import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";

/**
 * ============================================================================
 * 2. IMAGE UPLOAD HELPER (FIREBASE STORAGE)
 * ============================================================================
 * Converts a local device camera URI to a Blob, uploads it to a client-secured
 * Firebase Storage path, and returns the public download URL.
 * 
 * @param {string} imageUri - The local URI of the image from camera/gallery.
 * @param {string} userId - The authenticated user's ID.
 * @returns {Promise<string>} Public download URL of the uploaded image file.
 */
export async function uploadBookingImage(imageUri, userId) {
  if (!imageUri) throw new Error("Image URI is required for upload.");
  
  try {
    // Convert local URI file into a blob using XMLHttpRequest (XHR) to prevent indefinite hangs in React Native
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.error("XHR conversion to blob failed:", e);
        reject(new Error("Failed to convert image URI to blob."));
      };
      xhr.responseType = "blob";
      xhr.open("GET", imageUri, true);
      xhr.send(null);
    });
    
    // Create unique timestamp-based filename
    const timestamp = Date.now();
    const storagePath = `bookings/${userId}/${timestamp}.jpg`;
    
    // Get storage reference node
    const imageRef = ref(storage, storagePath);
    
    // Upload binary stream to Firebase Storage
    const uploadResult = await uploadBytes(imageRef, blob);
    
    // Fetch and return public download link
    const downloadURL = await getDownloadURL(uploadResult.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error during image upload to Firebase Storage:", error);
    throw error;
  }
}

/**
 * ============================================================================
 * 3. BOOKING MUTATION FUNCTION
 * ============================================================================
 * Handles the complete booking creation pipeline: uploads images if provided,
 * structures the final Firestore document schema, and submits the job request.
 * 
 * @param {object} bookingData - Metadata containing service details, slots, notes, location, and estimate.
 * @param {string} [imageUri] - Optional local camera device file path.
 * @returns {Promise<string>} The newly created Firestore document reference ID.
 */
export async function submitJobRequest(bookingData, imageUri) {
  const { 
    clientId, 
    serviceType, 
    scheduledSlot, 
    notes, 
    location, 
    totalEstimate 
  } = bookingData;

  // Validate mandatory fields to avoid empty database attributes
  if (!clientId) throw new Error("Client ID is required to create a booking.");
  if (!serviceType) throw new Error("Service Type is required.");
  if (!scheduledSlot) throw new Error("Scheduled Slot details are required.");
  if (!location || location.lat === undefined || location.lng === undefined) {
    throw new Error("Valid coordinates (latitude and longitude) are required.");
  }

  try {
    let uploadedImageURL = null;
    
    // 1. Process visual file upload if an image exists
    if (imageUri) {
      uploadedImageURL = await uploadBookingImage(imageUri, clientId);
    }
    
    // 2. Prepare the complete normalized document payload matching schema
    const payload = {
      clientId,
      professionalId: null, // Remains null until accepted by an expert
      serviceType: serviceType.toLowerCase().trim(),
      scheduledSlot: {
        date: scheduledSlot.date,
        day: scheduledSlot.day,
        time: scheduledSlot.time
      },
      notes: notes || "",
      problemImageURL: uploadedImageURL,
      location: {
        lat: location.lat,
        lng: location.lng
      },
      status: "pending", // Default system initial state
      totalEstimate: totalEstimate || "₹0",
      createdAt: serverTimestamp() // Safe server-side creation timestamp
    };
    
    // 3. Write document to 'bookings' Firestore collection
    const bookingsCollectionRef = collection(db, "bookings");
    const docRef = await addDoc(bookingsCollectionRef, payload);
    
    return docRef.id;
  } catch (error) {
    console.error("Error creating job request in Firestore:", error);
    throw error;
  }
}

/**
 * ============================================================================
 * 4. REAL-TIME QUERIES ('onSnapshot')
 * ============================================================================
 */

/**
 * Streams active bookings associated with a specific Client in real time.
 * Excellent for immediate status updates ('pending' -> 'accepted' -> 'completed').
 * 
 * @param {string} userId - The client's unique user identifier.
 * @param {function} onUpdate - Success callback that receives updated list of bookings.
 * @param {function} onError - Error callback handled in case of database disconnects.
 * @returns {function} Unsubscribe cleanup function. Call on component unmount.
 */
export function subscribeClientActiveBookings(userId, onUpdate, onError) {
  if (!userId) {
    throw new Error("Client User ID is required to stream active bookings.");
  }
  
  const bookingsRef = collection(db, "bookings");
  
  // Construct dynamic query returning active status jobs ordered by creation time
  const q = query(
    bookingsRef,
    where("clientId", "==", userId),
    orderBy("createdAt", "desc")
  );
  
  // Start active websocket connection
  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const bookings = [];
      querySnapshot.forEach((doc) => {
        bookings.push({
          bookingId: doc.id,
          ...doc.data()
        });
      });
      onUpdate(bookings);
    },
    (error) => {
      console.error(`Real-time Client listen failed for User ID ${userId}:`, error);
      if (onError) onError(error);
    }
  );
  
  // Unsubscribe listener handle
  return unsubscribe;
}

/**
 * Streams incoming 'pending' bookings belonging to a specific professional
 * service type (e.g. plumbing, electrician) so nearby experts can claim them.
 * 
 * @param {string} serviceType - Category type matching the professional's profile.
 * @param {function} onUpdate - Success callback receiving new pending booking requests.
 * @param {function} onError - Error callback for connection drops.
 * @returns {function} Unsubscribe cleanup function. Call on component unmount.
 */
export function subscribeProfessionalIncomingRequests(serviceType, onUpdate, onError) {
  if (!serviceType) {
    throw new Error("Service type category is required to stream pending requests.");
  }
  
  const bookingsRef = collection(db, "bookings");
  const normalizedType = serviceType.toLowerCase().trim();
  
  // Query pending requests for matching expert role
  const q = query(
    bookingsRef,
    where("serviceType", "==", normalizedType),
    where("status", "==", "pending"),
    orderBy("createdAt", "desc")
  );
  
  // Set up active socket listener
  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const pendingRequests = [];
      querySnapshot.forEach((doc) => {
        pendingRequests.push({
          bookingId: doc.id,
          ...doc.data()
        });
      });
      onUpdate(pendingRequests);
    },
    (error) => {
      console.error(`Real-time Professional listen failed for type ${serviceType}:`, error);
      if (onError) onError(error);
    }
  );
  
  // Return cleanup listener
  return unsubscribe;
}
