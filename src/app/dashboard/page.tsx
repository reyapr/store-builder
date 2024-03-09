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
import 'chartjs-adapter-date-fns';
import { useEffect, useState } from "react";
import { Line } from 'react-chartjs-2'
import moment from 'moment';


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

export const options = {
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
 
};

export default function HomeDashboard() {
  const [data, setData] = useState([])
  const [timeFrame, setTimeFrame] = useState(ETimeFrame.DAILY)
  
  const fetchData = async (timeFrame: ETimeFrame) => {
    const response = await axios.get(`/api/order/total-order?timeFrame=${timeFrame}`);
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
    fetchData(timeFrame);
  },[timeFrame])
  
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
      <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <button onClick={() => setTimeFrame(ETimeFrame.DAILY)}>Daily</button>
        <button onClick={() => setTimeFrame(ETimeFrame.WEEKLY)}>Weekly</button>
        <button onClick={() => setTimeFrame(ETimeFrame.MONTHLY)}>Monthly</button>
      </div>
      <div style={{ display: 'flex', flex: 11, justifyContent: 'center', alignItems: 'center' }}>
        <Line options={options} data={dataChart} />
      </div>
    </Layout>
  );
}
