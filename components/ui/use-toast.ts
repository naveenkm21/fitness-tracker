"use client"

// Adapted from: https://github.com/shadcn-ui/ui/blob/main/apps/www/registry/default/ui/use-toast.ts
import { useState, useEffect, useCallback, type ReactNode } from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToastProps = {
  id: string
  title?: string
  description?: string
  action?: ReactNode
  variant?: "default" | "destructive"
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const dismiss = useCallback((toastId?: string) => {
    setToasts((toasts) => {
      if (toastId) {
        return toasts.filter((toast) => toast.id !== toastId)
      }
      return []
    })
  }, [])

  const toast = useCallback(
    ({ ...props }: Omit<ToastProps, "id">) => {
      const id = genId()

      const newToast = {
        ...props,
        id,
      }

      setToasts((toasts) => {
        const updatedToasts = [newToast, ...toasts].slice(0, TOAST_LIMIT)
        return updatedToasts
      })

      const timeout = setTimeout(() => {
        dismiss(id)
        toastTimeouts.delete(id)
      }, TOAST_REMOVE_DELAY)

      toastTimeouts.set(id, timeout)

      return id
    },
    [dismiss],
  )

  useEffect(() => {
    return () => {
      for (const timeout of toastTimeouts.values()) {
        clearTimeout(timeout)
      }
    }
  }, [])

  return {
    toast,
    dismiss,
    toasts,
  }
}

