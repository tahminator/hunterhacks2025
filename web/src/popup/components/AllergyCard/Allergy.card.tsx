import { Allergy, Severity } from '@base/types'
import { Divider, Group, Paper, ScrollArea, Stack, Text } from '@mantine/core'

interface AllergyCardProps {
  profileName: string
  allergyList: Allergy[]
  isUser?: boolean
}

export function AllergyCard({
  profileName,
  allergyList,
  isUser = false,
}: AllergyCardProps) {
  const getColor = (level: Severity) => {
    switch (level) {
      case Severity.low:
        return {
          fill: '#C9D0A2',
          root: '#928d03',
        }
      case Severity.med:
        return {
          fill: '#FDCA9D',
          root: '#af5a00',
        }
      case Severity.high:
        return {
          fill: '#F48282',
          root: '#9e0419',
        }
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
    <Paper
      withBorder
      w={'180px'}
      h={'210px'}
      my={'xs'}
      p={'sm'}
      radius={'lg'}
      shadow={'md'}
    >
      <Stack align="center" gap={'5px'}>
        <Text>{!isUser ? profileName : 'You'}</Text>
        <Divider w={'100%'} />
        <ScrollArea w={'100%'} h={'140px'}>
          {allergyList.map((allergy: Allergy, index) => {
            return (
              <Paper
                key={index}
                my={'5px'}
                w={'100%'}
                py={'2px'}
                bg={getColor(allergy.severity).fill}
              >
                <Group
                  px={'lg'}
                  key={allergy.itemName}
                  align="center"
                  justify="center"
                >
                  <Text flex={1} size="sm" fw={'500'}>
                    {allergy.itemName}
                  </Text>
                  <Text tt="capitalize" size="xs">
                    ({displayLevel(allergy.severity).substring(0, 3)})
                  </Text>
                </Group>
              </Paper>
            )
          })}
        </ScrollArea>
      </Stack>
    </Paper>
  )
}
