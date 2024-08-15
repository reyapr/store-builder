'use client'

import React, { useState } from 'react'

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import {
  Flex,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from '@chakra-ui/react'
import { addWeeks, differenceInDays, startOfWeek, subWeeks } from 'date-fns'

import { getSchedules } from '@/app/admin/schedules/actions'
import { Layout } from '@/components'
import TabContent from '@/components/admin/schedules/TabContent'
import { date } from '@/utils'

export default function Store() {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  )

  const [selectedDay, setSelectedDay] = useState(new Date())

  const { data: schedules, isFetching, error } = getSchedules()

  const breadcrumbs = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Toko', path: '/admin/stores' }
  ]

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeekStart((prevDate) =>
      direction === 'next' ? addWeeks(prevDate, 1) : subWeeks(prevDate, 1)
    )
  }

  const handleTabChange = (index: number) => {
    setSelectedDay(weekDays[index])
  }

  const weekDays = date.getDaysOfWeek(currentWeekStart)

  return (
    <Layout
      breadcrumbs={breadcrumbs}
      isFetching={isFetching}
      error={error as Error}
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
            <Tabs
              defaultIndex={differenceInDays(new Date(), currentWeekStart)}
              variant="enclosed"
              flex={1}
              onChange={handleTabChange}
            >
              <TabList>
                {weekDays.map((day, index) => (
                  <Tab key={index}>{date.formatDate(day)}</Tab>
                ))}
              </TabList>
              <TabPanels>
                {weekDays.map((day, index) => (
                  <TabPanel key={index}>
                    <TabContent
                      day={day}
                      selectedDay={selectedDay}
                      schedules={schedules}
                    />
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
        </>
      )}
    </Layout>
  )
}
