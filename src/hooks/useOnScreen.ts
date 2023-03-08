import { useEffect, useState, useRef, RefObject } from 'react'

export default function useOnScreen(
  ref: RefObject<HTMLElement>,
  options?: IntersectionObserverInit
) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [isOnScreen, setIsOnScreen] = useState(false)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => setIsOnScreen(entry.isIntersecting),
      options
    )
  }, [options])

  useEffect(() => {
    observerRef.current!.observe(ref.current!)

    return () => {
      observerRef.current!.disconnect()
    }
  }, [ref])

  return isOnScreen
}
