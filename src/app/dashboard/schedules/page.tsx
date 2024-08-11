'use client'

import React, { useState } from 'react'

import { ChevronLeftIcon, ChevronRightIcon, AddIcon } from '@chakra-ui/icons'
import {
  Button,
  Text,
  Flex,
  IconButton,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Select,
  VStack,
  useToast
} from '@chakra-ui/react'
import { addWeeks, startOfWeek, subWeeks, format } from 'date-fns'

import { getProducts } from '@/app/dashboard/products/actions'
import { getSchedules, postSchedules } from '@/app/dashboard/schedules/actions'
import { Layout, CardProduct } from '@/components'
import { date } from '@/utils'

export default function Store() {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date())
  )
  const [selectedDay, setSelectedDay] = useState(new Date())
  const [selectedProductId, setSelectedProductId] = useState('')
  const {
    data: schedules,
    isFetching,
    error,
    refetch: refetchSchedules
  } = getSchedules()
  const {
    data: products,
    isFetching: isProductsFetching,
    error: productsError
  } = getProducts()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const { mutate, isPending } = postSchedules({
    onSuccess() {
      toast({
        title: 'Success',
        description: 'Schedule added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      })
      onClose()
      refetchSchedules()
    },
    onError() {
      toast({
        title: 'Error',
        description: 'Failed to add schedule',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  })

  const weekDays = date.getDaysOfWeek(currentWeekStart)

  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Toko', path: '/dashboard/stores' }
  ]

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeekStart((prevDate) =>
      direction === 'next' ? addWeeks(prevDate, 1) : subWeeks(prevDate, 1)
    )
  }

  const handleTabChange = (index: number) => {
    setSelectedDay(weekDays[index])
  }

  return (
    <Layout
      breadcrumbs={breadcrumbs}
      isFetching={isFetching || isProductsFetching}
      error={(error || productsError) as Error}
    >
      {schedules && (
        <>
          <Flex align="center">
            <IconButton
              alignSelf="start"
              aria-label="Previous week"
              icon={<ChevronLeftIcon />}
              onClick={() => navigateWeek('prev')}
              mr={2}
            />
            <Tabs variant="enclosed" flex={1} onChange={handleTabChange}>
              <TabList>
                {weekDays.map((day, index) => (
                  <Tab key={index}>{date.formatDate(day)}</Tab>
                ))}
              </TabList>
              <TabPanels>
                {weekDays.map((day, index) => (
                  <TabPanel key={index}>
                    <Text fontSize="xl" fontWeight="bold" mb={4}>
                      Menu untuk {date.formatDate(day)}
                    </Text>
                    {date.getScheduleForDay(day, schedules).length > 0 ? (
                      <SimpleGrid columns={[1, 2, 3]} gap={6}>
                        {date
                          .getScheduleForDay(day, schedules)
                          .flatMap((schedule) =>
                            schedule.productSchedules.map((productSchedule) => (
                              <CardProduct
                                key={`${schedule.id}-${productSchedule.scheduleId}`}
                                product={productSchedule.product}
                                editable={false}
                              />
                            ))
                          )}
                        <Button onClick={onOpen} h="300px" w="250px">
                          <AddIcon />
                        </Button>
                      </SimpleGrid>
                    ) : (
                      <VStack align="start" gap={6}>
                        <Text w="full">Tidak ada menu untuk hari ini</Text>
                        <Button onClick={onOpen} h="300px" w="250px">
                          <AddIcon />
                          <Text color="grey.300"> Tambah menu</Text>
                        </Button>
                      </VStack>
                    )}
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
            <IconButton
              alignSelf="start"
              aria-label="Next week"
              icon={<ChevronRightIcon />}
              onClick={() => navigateWeek('next')}
              ml={2}
            />
          </Flex>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                Tambah menu untuk tanggal {date.formatDate(selectedDay)}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <FormLabel>Pilih menu</FormLabel>
                  <Select
                    placeholder="Pilih menu"
                    onChange={(e) => setSelectedProductId(e.target.value)}
                  >
                    {products &&
                      products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.store.name} - {product.name}
                        </option>
                      ))}
                  </Select>
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={() =>
                    mutate({
                      productId: selectedProductId,
                      date: format(selectedDay, 'yyyy-MM-dd')
                    })
                  }
                  isDisabled={!selectedProductId}
                  isLoading={isPending}
                >
                  Tambah
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  Batal
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </Layout>
  )
}
