'use client';
import Layout from "@/components/Layout";
import { ETimeFrame } from "@/constants/order";
import axios from "axios";
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
} from 'chart.js';
import { useEffect, useState } from "react";
import { Line } from 'react-chartjs-2'
import moment from 'moment';
import { Box, Button, Flex, Select } from "@chakra-ui/react";


ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Total Order Chart',
    },
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
};

export default function HomeDashboard() {
  const years = Array.from({ length : 5}, (_, i) => new Date().getFullYear() - i)
  const [data, setData] = useState([])
  const [timeFrame, setTimeFrame] = useState(ETimeFrame.DAILY)
  const [year, setYear] = useState(years[0])
  
  const fetchData = async (timeFrame: ETimeFrame, year: number) => {
    const response = await axios.get(`/api/order/total-order`, {
      params: { timeFrame, year }
    });
    const dataChartFormat = response.data.result.map((item: any) => {
      let x;
      switch (item.time_frame) {
        case ETimeFrame.DAILY:
          x = moment(item.time).format('DD MMMM YYYY');
          break;
        case ETimeFrame.WEEKLY:
          const startOfWeek = moment(moment().week(item.time)).startOf('month').get('week')
          const weekInMonth = Number(item.time) - startOfWeek + 1;
          x = moment().week(item.time).format('MMMM') + ' week ' + weekInMonth;
          break;
        case ETimeFrame.MONTHLY:
          x = moment(item.time, 'MM').format('MMMM');
          break;
        default:
          break;
      }
      
      return {
        x,
        y: item.total_amount
      }
    })
    setData(dataChartFormat);
  }
  
  useEffect(() => {
    fetchData(timeFrame, year);
  },[timeFrame, year])
  
  const dataChart = {
    datasets: [
      {
        label: 'Total Order',
        data,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ]
  }
  
  return (
    <Layout>
      <Flex>
        <Box>
          <Button onClick={() => setTimeFrame(ETimeFrame.DAILY)}>Daily</Button>
          <Button onClick={() => setTimeFrame(ETimeFrame.WEEKLY)}>Weekly</Button>
          <Button onClick={() => setTimeFrame(ETimeFrame.MONTHLY)}>Monthly</Button>
        </Box>
        <Box>
          <Select placeholder='Select option' value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Select>
        </Box>
      </Flex>
      <div style={{ display: 'flex', flex: 11, justifyContent: 'center', alignItems: 'center' }}>
        <Line options={options} data={dataChart} />
      </div>
    </Layout>
  );
}
