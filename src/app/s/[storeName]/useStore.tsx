/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'

export const useStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F,
  storeName: string
) => {
  const result = store(callback) as F

  const [data, setData] = useState<F>({} as F)

  useEffect(() => {
    store &&
      (store as any).persist?.setOptions({
        name: `cart-${storeName}`
      })
    store && (store as any).persist?.rehydrate()
    setData(result)
  }, [])

  return data
}
