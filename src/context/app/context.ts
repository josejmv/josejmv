// main tools
import { createContext } from 'react'

// types
import { Toast } from 'primereact/toast'

type CreateContextDataType = { toast: () => Toast | undefined }

export const AppContext = createContext<CreateContextDataType>({
  toast: () => undefined,
})
