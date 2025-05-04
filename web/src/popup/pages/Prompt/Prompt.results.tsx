import { Box, ScrollArea } from '@mantine/core'
import { appHeight } from '@base/theme/theme'

interface ItemReport {
  title: string
  description: string
  severity: 'low' | 'medium' | 'high'
}

interface ProfileReport {
  name: string
  foods: ItemReport[]
}

interface AllergyReport {
  message: string
  data: ProfileReport[]
}
export function PromptResults({ report }: AllergyReport) {
  return (
    <Box style={{ overflow: 'hidden' }}>
      <ScrollArea h={appHeight} pb={'2px'}></ScrollArea>
    </Box>
  )
}
