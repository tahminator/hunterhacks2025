import {
  Stack,
  Box,
  Title,
  ActionIcon,
  Group,
  Paper,
  Button,
  Text,
  ScrollArea,
  List,
  ListItem,
  LoadingOverlay,
  Modal,
} from '@mantine/core'
import styles from './Profile.module.css'
import AllergyItem from '@base/popup/components/AllergyItem'
import { Severity, AllergenProfile } from '@base/types'
import { appHeight } from '@base/theme/theme'
import { Carousel } from '@mantine/carousel'
// import { useDisclosure } from '@mantine/hooks'
import { useLogoutMutation } from '@base/popup/api/auth'
import { useActiveProfileQuery } from '@base/popup/api/user'
import { useDisclosure } from '@mantine/hooks'
import { AllergyAddCard } from './Allergy.add.card'

interface ProfileDataProps {
  profile: AllergenProfile
}

function ProfileData({ profile }: ProfileDataProps) {
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
      className={styles.profileContainer}
      pos={'relative'}
      radius={'md'}
      bd={'1px solid'}
      p="lg"
    >
      <Stack gap={'5px'} w={'100%'}>
        <Title order={2}>{profile.name}</Title>
        <List>
          {profile.allergies.map((allergy, index) => {
            return (
              <ListItem key={index}>
                <Text
                  display={'inline'}
                  c={getColor(allergy.severity).root}
                  fw={'500'}
                >
                  {allergy.itemName}
                </Text>{' '}
                <Text size="xs" display={'inline'} fs={'italic'}>
                  ({displayLevel(allergy.severity)})
                </Text>
              </ListItem>
            )
          })}
        </List>
      </Stack>
    </Paper>
  )
}

export default function ProfilePage() {
  const { mutate: logout } = useLogoutMutation()
  const { data: activeUser, isLoading: activeUserIsLoading } =
    useActiveProfileQuery()

  const [
    addAllergyOpened,
    { open: openAllergyDrawer, close: closeAllergyDrawer },
  ] = useDisclosure(false)
  // const { status, isLoading } = useProfilesQuery()
  // const [openedProfiles, { openProfiles, closeProfiles }] = useDisclosure(false)

  if (activeUserIsLoading || !activeUser?.data) {
    console.log('active', activeUser)
    return <LoadingOverlay />
  }

  const { firstName, allergies, id } = activeUser.data
  const profiles: AllergenProfile[] = []
  return (
    <>
      <ScrollArea h={appHeight}>
        <Stack>
          <Box id={styles.profileHeader} h={'230px'} w={'100%'}>
            <Stack pos={'relative'} align="center" py={'xl'} px={'sm'}>
              <Title size={'xl'} fw={'600'}>
                Hi {firstName}!
              </Title>
              <Group pos="absolute" right={'30px'} flex={1}>
                <ActionIcon
                  onClick={() => logout()}
                  size={'lg'}
                  pl={'auto'}
                  c={'black'}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
                    />
                  </svg>
                </ActionIcon>
              </Group>

              <Paper bg={'gray.3'} w={'90px'} h={'90px'} radius={'50px'}>
                <Stack w={'100%'} h={'100%'} justify="center" align="center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="50"
                    height="50"
                    fill="black"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                  </svg>
                </Stack>
              </Paper>
            </Stack>
            <Box
              mt={'5px'}
              ml={'lg'}
              mb={'-15px'}
              bg={'black'}
              w={'200px'}
              px={'15px'}
              py={'6px'}
              mr="auto"
            >
              <Title fw={'600'} lts={'0.4px'} size={'lg'} c={'white'}>
                My Allergies
              </Title>
            </Box>
            <Stack
              w={'95%'}
              aria-label="my-allergen-list"
              mt={'20px'}
              gap={'0'}
              px={'lg'}
            >
              {allergies.map((allergy, idx) => {
                return <AllergyItem allergy={allergy} key={idx} />
              })}
            </Stack>
            <Stack px={'md'} my={'lg'}>
              <Button onClick={openAllergyDrawer} fullWidth color={'olivine.6'}>
                + Add Allergy
              </Button>
            </Stack>
            <Stack aria-label="other-profiles" px={'lg'}>
              <Group style={{ borderTop: '1px solid ' }}>
                <Box bg={'black'} w={'150px'} px={'sm'}>
                  <Title c={'white'} size={'md'}>
                    Other Profiles
                  </Title>
                </Box>
              </Group>
              <Text
                fw={'light'}
                fs={'italic'}
                size="0.8rem"
                px={'2px'}
                py={'0.2rem'}
              >
                Add allergens for your friends, family, coworkers{' '}
              </Text>
              <Button
                hidden={profiles.length > 0}
                c={'black'}
                color="gray.4"
                fullWidth
                mt={'md'}
              >
                +
              </Button>
              <Carousel
                orientation="vertical"
                withIndicators
                slideGap="md"
                mb={'lg'}
                height={'200px'}
                align="start"
                slideSize={'auto'}
                loop
              >
                {profiles.map((profile: AllergenProfile, index) => {
                  return (
                    <Carousel.Slide key={index}>
                      <ProfileData profile={profile} />
                      <Button
                        c={'black'}
                        color="gray.4"
                        fullWidth
                        mt={'md'}
                        // onClick={() => openProfiles()}
                      >
                        +
                      </Button>
                    </Carousel.Slide>
                  )
                })}
              </Carousel>
            </Stack>
          </Box>
        </Stack>
      </ScrollArea>
      <Modal size={'sm'} opened={addAllergyOpened} onClose={closeAllergyDrawer}>
        <AllergyAddCard id={id} close={closeAllergyDrawer} />
      </Modal>
    </>
  )
}
