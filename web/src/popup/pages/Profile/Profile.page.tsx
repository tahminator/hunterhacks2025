import { Stack, Box, Text, ActionIcon, Group } from '@mantine/core'
import styles from './Profile.module.css'

export default function ProfilePage() {
  const firstName = 'User'
  return (
    <Stack>
      <Box id={styles.profileHeader} h={'200px'}>
        <Stack>
          <Group>
            <Box flex={1} />
            <Text flex={2}>Hi {firstName}!</Text>
            <ActionIcon></ActionIcon>
          </Group>
        </Stack>
      </Box>
    </Stack>
  )
}
