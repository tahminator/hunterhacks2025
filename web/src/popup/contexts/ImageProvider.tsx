import { ImageContext } from './ImageContext'
import { useState, PropsWithChildren } from 'react'

export function ImageProvider(props: PropsWithChildren) {
  const [snapshotData, setSnapshotData] = useState<string>('')

  return (
    <ImageContext.Provider
      value={{
        snapshotData,
        setSnapshotData,
      }}
    >
      {props.children}
    </ImageContext.Provider>
  )
}
