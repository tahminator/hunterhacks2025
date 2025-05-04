import { createContext } from 'react'

export const ImageContext = createContext({
  snapshotData: '',

  setSnapshotData: (temp: string) => {
    console.log(temp)
    return
  },
})
