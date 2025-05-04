import type { Allergy } from '@base/types'
import { Severity } from '@base/types'
import { ActionIcon, Box, Group, Paper, Text } from '@mantine/core'
import { RingProgress } from '@mantine/core'

interface AllergyItemProps {
  allergy: Allergy
  hideable?: boolean
}

export function AllergyItem({ allergy, hideable = false }: AllergyItemProps) {
  const getColor = (level: Severity) => {
    switch (level) {
      case Severity.low:
        return {
          fill: '#d9d02f',
          root: '#928d03',
        }
      case Severity.med:
        return {
          fill: '#fc8c0c',
          root: '#e08641',
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

  const displayLevel = (level: Severity) => {
    switch (level) {
      case Severity.low:
        return 'Slight'
      case Severity.med:
        return 'Medium'
      case Severity.high:
        return 'Severe'
    }
  }

  return (
    <Paper my={'xs'} withBorder radius={'xl'} shadow={'md'}>
      <Group
        pos={'relative'}
        h={'2rem'}
        px={'20px'}
        style={{ borderRadius: '20px' }}
      >
        <ActionIcon display={!hideable ? 'none' : 'block'} />
        <Text flex={1}>{allergy.itemName}</Text>
        <Text tt="capitalize" size="sm" fw={'600'} pr={38}>
          {displayLevel(allergy.severity)}
        </Text>
        <Box pos={'absolute'} right={'-7px'} mx={0}>
          <RingProgress
            rootColor={getColor(allergy.severity).root}
            transitionDuration={250}
            size={55}
            thickness={8}
            roundCaps
            sections={[
              {
                value: getSize(allergy.severity),
                color: getColor(allergy.severity).fill,
              },
            ]}
          />
        </Box>
      </Group>
    </Paper>
  )
}
