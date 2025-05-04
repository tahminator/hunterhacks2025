import { useAllergyMutation } from '@base/popup/api/user'
import { Severity } from '@base/types'
import { Stack, TextInput, Title, Text, Group, Button } from '@mantine/core'
import { useState } from 'react'

interface AllergyAddCardProps {
  id: string
  close: () => void
}

export function AllergyAddCard({ close, id }: AllergyAddCardProps) {
  const { mutate } = useAllergyMutation()
  const [text, setText] = useState('')
  const [severity, setSeverity] = useState<Severity>(Severity.low)

  const severityOptions = [
    { value: Severity.low, label: 'Mild', color: 'yellow' },
    { value: Severity.med, label: 'Moderate', color: 'orange' },
    { value: Severity.high, label: 'Severe', color: 'red' },
  ]

  return (
    <Stack gap={'xs'}>
      <Title>Add Allergy</Title>
      <TextInput
        label="Enter your allergen"
        placeholder="eg. Gluten"
        value={text}
        onChange={(event) => setText(event.currentTarget.value)}
      />

      <Text size="sm" fw={500} mt="md">
        Severity
      </Text>
      <Group gap="xs">
        {severityOptions.map((option) => (
          <Button
            key={option.value}
            variant={severity === option.value ? 'filled' : 'light'}
            color={option.color}
            onClick={() => setSeverity(option.value)}
            size="sm"
          >
            {option.label}
          </Button>
        ))}
      </Group>

      <Group justify="flex-end" mt="xl">
        <Button color="olivine" variant="subtle" onClick={close}>
          Cancel
        </Button>
        <Button
          color="olivine"
          disabled={!text || !severity}
          onClick={() => {
            mutate({ itemName: text, severity, id })
            close()
          }}
        >
          Save
        </Button>
      </Group>
    </Stack>
  )
}
