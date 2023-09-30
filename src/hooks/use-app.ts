// main tools
import { useContext } from 'react'

// context
import { AppContext } from 'context/app/context'

export const useApp = () => useContext(AppContext)
