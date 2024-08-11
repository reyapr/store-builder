'use client'

import React, { useState } from 'react'

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import {
  Button,
  Box,
  Text,
  Flex,
  IconButton,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  HStack,
  VStack
} from '@chakra-ui/react'
import { addWeeks, startOfWeek, subWeeks } from 'date-fns'

import { getSchedules } from '@/app/dashboard/schedules/actions'
import { Layout } from '@/components'
import { currency, date } from '@/utils'

export default function Store() {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date())
  )
  const { data: schedules, isFetching, error } = getSchedules()

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

  return (
    <Layout
      breadcrumbs={breadcrumbs}
      isFetching={isFetching}
      error={error as Error}
      rightHeaderComponent={
        <Button colorScheme="blue" size="sm" onClick={() => {}}>
          Tambah menu
        </Button>
      }
    >
      {schedules && (
        <>
          <Flex align="center">
            <IconButton
              aria-label="Previous week"
              icon={<ChevronLeftIcon />}
              onClick={() => navigateWeek('prev')}
              mr={2}
            />
            <Tabs variant="enclosed" flex={1}>
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
                      date.getScheduleForDay(day, schedules).map((schedule) => (
                        <VStack key={schedule.id} align="stretch" spacing={4}>
                          {schedule.productSchedules.map((productSchedule) => (
                            <HStack
                              key={productSchedule.scheduleId}
                              spacing={4}
                              p={2}
                              borderWidth={1}
                              borderRadius="md"
                            >
                              <Image
                                src={productSchedule.product.imageUrl}
                                alt={productSchedule.product.name}
                                boxSize="50px"
                                objectFit="cover"
                                borderRadius="md"
                              />
                              <Box>
                                <Text fontWeight="bold">
                                  {productSchedule.product?.store?.name} -{' '}
                                  {productSchedule.product.name}
                                </Text>
                                <Text>
                                  Harga:{' '}
                                  {currency.toIDRFormat(
                                    productSchedule.product.price
                                  )}
                                </Text>
                              </Box>
                            </HStack>
                          ))}
                        </VStack>
                      ))
                    ) : (
                      <Text>Tidak ada menu untuk hari ini</Text>
                    )}
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
            <IconButton
              aria-label="Next week"
              icon={<ChevronRightIcon />}
              onClick={() => navigateWeek('next')}
              ml={2}
            />
          </Flex>
        </>
      )}
    </Layout>
  )
}
