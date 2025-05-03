import { Severity } from '@base/types'
import { ActionIcon, Box, Group, Text } from '@mantine/core'
import { RingProgress } from '@mantine/core'

interface AllergyItemProps {
  name: string
  severity: Severity
  hideable?: boolean
}

export function AllergyItem({
  name,
  severity,
  hideable = false,
}: AllergyItemProps) {
  const getSize = (level: Severity) => {
    switch (level) {
      case Severity.low:
        return 30
      case Severity.med:
        return 60
      case Severity.high:
        return 100
    }
  }

  //   const getColor = (level: Severity) => {}

  return (
    <Box my={'xs'}>
      <Group
        pos={'relative'}
        bg={'red'}
        h={'2rem'}
        px={'20px'}
        style={{ borderRadius: '20px' }}
      >
        <ActionIcon display={!hideable ? 'none' : 'block'} />
        <Text>{name}</Text>
        <Box pos={'absolute'} right={'-15px'} mx={0}>
          <RingProgress
            transitionDuration={250}
            size={60}
            thickness={8}
            roundCaps
            sections={[{ value: getSize(severity), color: 'rgba(0,0,0,1)' }]}
          />
        </Box>
      </Group>
    </Box>
  )
}
