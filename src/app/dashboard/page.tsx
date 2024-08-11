'use client'

import React, { useEffect, useState } from 'react'

import { Button, Flex, Select, HStack } from '@chakra-ui/react'
import axios from 'axios'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js'
import {
  format,
  startOfWeek,
  getWeek,
  getMonth,
  setWeek,
  setMonth
} from 'date-fns'
import { Line } from 'react-chartjs-2'

import { Layout } from '@/components'
import { ETimeFrame } from '@/constants/order'

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale
)

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const
    },
    title: {
      display: true,
      text: 'Total Order Chart'
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Time Frame'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Amount (IDR)'
      }
    }
  }
}

export default function HomeDashboard() {
  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  )
  const [data, setData] = useState([])
  const [timeFrame, setTimeFrame] = useState(ETimeFrame.DAILY)
  const [year, setYear] = useState(years[0])

  const fetchData = async (timeFrame: ETimeFrame, year: number) => {
    const response = await axios.get(`/api/orders/total-order`, {
      params: { timeFrame, year }
    })
    const dataChartFormat = response.data.result.map((item: any) => {
      let x
      switch (item.time_frame) {
        case ETimeFrame.DAILY:
          x = format(new Date(item.time), 'dd MMMM yyyy')
          break
        case ETimeFrame.WEEKLY: {
          const currentDate = new Date()
          const firstDayOfMonth = new Date(
            currentDate.getFullYear(),
            getMonth(currentDate),
            1
          )
          const startOfWeekDate = startOfWeek(firstDayOfMonth)
          const startOfWeekNumber = getWeek(startOfWeekDate)
          const weekInMonth = Number(item.time) - startOfWeekNumber + 1
          const targetDate = setWeek(currentDate, Number(item.time))
          x = format(targetDate, 'MMMM') + ' week ' + weekInMonth
          break
        }
        case ETimeFrame.MONTHLY:
          x = format(setMonth(new Date(), Number(item.time) - 1), 'MMMM')
          break
        default:
          break
      }

      return {
        x,
        y: item.total_amount
      }
    })
    setData(dataChartFormat)
  }

  useEffect(() => {
    fetchData(timeFrame, year)
  }, [timeFrame, year])

  const dataChart = {
    datasets: [
      {
        label: 'Total Order',
        data,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      }
    ]
  }

  return (
    <Layout>
      <Flex>
        <HStack gap={3}>
          <Button
            px={6}
            colorScheme="blue"
            onClick={() => setTimeFrame(ETimeFrame.DAILY)}
          >
            Daily
          </Button>
          <Button
            colorScheme="blue"
            px={6}
            onClick={() => setTimeFrame(ETimeFrame.WEEKLY)}
          >
            Weekly
          </Button>
          <Button
            colorScheme="blue"
            px={6}
            onClick={() => setTimeFrame(ETimeFrame.MONTHLY)}
          >
            Monthly
          </Button>
          <Select
            placeholder="Select option"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        </HStack>
      </Flex>
      <div
        style={{
          display: 'flex',
          flex: 11,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Line options={options} data={dataChart} />
      </div>
    </Layout>
  )
}
