import { Severity } from '@base/types'
import { ActionIcon, Box, Group, Paper, Text } from '@mantine/core'
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
  const getColor = (level: Severity) => {
    switch (level) {
      case Severity.low:
        return {
          fill: '#d9d02f',
          root: '#928d03',
        }
      case Severity.med:
        return {
          fill: '#f06418',
          root: '#bf4906',
        }
      case Severity.high:
        return {
          fill: '#d8070b',
          root: '#9e0419',
        }
    }
  }
  const getSize = (level: Severity) => {
    switch (level) {
      case Severity.low:
        return 30
      case Severity.med:
        return 60
      case Severity.high:
        return 85
    }
  }

  //   const getColor = (level: Severity) => {}

  return (
    <Paper my={'xs'} withBorder  radius={'xl'} shadow={'md'}>
      <Group
        pos={'relative'}
        h={'2rem'}
        px={'20px'}
        style={{ borderRadius: '20px' }}
      >
        <ActionIcon display={!hideable ? 'none' : 'block'} />
        <Text flex={1}>{name}</Text>
        <Text  size='sm' fw={"600"} pr={38}>{severity}</Text>
        <Box pos={'absolute'} right={'-9px'} mx={0}>
          <RingProgress
            rootColor={getColor(severity).root}
            transitionDuration={250}
            size={55}
            thickness={8}
            roundCaps
            sections={[
              { value: getSize(severity), color: getColor(severity).fill },
            ]}
          />
        </Box>
      </Group>
    </Paper>
  )
}
