import React from 'react'

import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  type User
} from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'
import { deleteObject, getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyAmMxlkpxZWaKdMLJCfJejYRxoZuA4iETk',
  authDomain: 'bafstore-f2842.firebaseapp.com',
  projectId: 'bafstore-f2842',
  storageBucket: 'bafstore-f2842.appspot.com',
  messagingSenderId: '459650481467',
  appId: '1:459650481467:web:c063c8973d303e2a7bcb1e',
  measurementId: 'G-0EQKXM9ZY0'
}

export const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const storage = getStorage(app)
export const db = getFirestore(app, 'bafkitchen-db')

export const handleGoogleLogin = async ({
  onError,
  onSuccess
}: {
  // eslint-disable-next-line no-unused-vars
  onError: React.Dispatch<React.SetStateAction<string | null>>
  // eslint-disable-next-line no-unused-vars
  onSuccess: (user: User) => void
}) => {
  try {
    const provider = new GoogleAuthProvider()
    const { user } = await signInWithPopup(auth, provider)
    onSuccess(user)
  } catch (error) {
    onError((error as Error).message)
  }
}

export const handleLogout = ({ onLogout }: { onLogout: () => void }) => {
  signOut(auth)
    .then(() => {
      // Sign-out successful
      console.log('User logged out successfully')
      onLogout()
    })
    .catch((error) => {
      // An error happened
      console.error('Error logging out:', error)
    })
}

export const handleEmailPasswordAuth = async ({
  isSignUp,
  email,
  password
}: {
  isSignUp: boolean
  email: string
  password: string
}) => {
  try {
    let userCredential
    if (isSignUp) {
      userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      console.log('User signed up:', userCredential.user)
    } else {
      userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log('User signed in:', userCredential.user)
    }
    return userCredential.user
  } catch (error) {
    console.error(
      `Error ${isSignUp ? 'signing up' : 'signing in'} with email/password`,
      error
    )
    return error
  }
}

export async function saveUserToFirestore(
  role: 'customer' | 'admin',
  user: UserArgs,
  options?: {
    // eslint-disable-next-line no-unused-vars
    onError?: (error: Error | string) => void
    // eslint-disable-next-line no-unused-vars
    onSuccess?: (user: UserArgs) => void
  }
) {
  try {
    const userRef = doc(db, 'users', user.uid)

    const docSnapshot = await getDoc(userRef)

    // Prepare the user data object
    const userData = {
      uid: user.uid,
      displayName: user.displayName || null,
      email: user.email || null,
      photoUrl: user.photoURL || null,
      phoneNumber: user.phoneNumber || null,
      role: role
    }

    if (docSnapshot.exists()) {
      options?.onSuccess?.(docSnapshot.data() as UserArgs)
      console.log('User data existed')
      return
    }

    // Save the user data to Firestore
    await setDoc(userRef, userData, { merge: false })
    console.log('User data saved successfully to Firestore')
    options?.onSuccess?.(user)
  } catch (error) {
    console.error('Error saving user data to Firestore:', error)
    options?.onError?.(error as Error)
  }
}

interface IFirebaseUploadResponse {
  downloadURL: string
  fullPath: string
}

export const uploadToFirebase = async (
  image: File
): Promise<IFirebaseUploadResponse> => {
  if (!process.env.FIREBASE_STORAGE_BUCKET) {
    throw new Error('FIREBASE_STORAGE_BUCKET is not defined')
  }

  const uniqueImageName = `${image.name}_${crypto.randomUUID()}`
  const imageRef = ref(storage, `images/${uniqueImageName}`)

  // Upload the file
  const uploadResult = await uploadBytes(imageRef, image)

  // Get the download URL
  const downloadURL = await getDownloadURL(uploadResult.ref)

  return {
    downloadURL,
    fullPath: uploadResult.ref.fullPath
  }
}

export const removeImageFromFirebase = async (imageUrl: string) => {
  try {
    // Extract the file path from the URL
    const pathSegment = imageUrl.split('/o/')[1].split('?')[0];
    const filePath = decodeURIComponent(pathSegment);

    // Delete the file from Firebase Storage
    const imageRef = ref(storage, filePath);
    await deleteObject(imageRef);
    console.log('File deleted successfully from Firebase Storage');

  } catch (error) {
    console.error('Error removing image from Firebase:', error);
  }
};
type UserArgs = {
  uid: string
  displayName: string | null
  email: string | null
  photoURL: string | null
  phoneNumber: string | null
}
