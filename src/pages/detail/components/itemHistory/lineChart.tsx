import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useEffect, useState } from 'react'

interface ChartDataProps {
  allPurchase: number[]
  allConsume: number[]
  initialYear: string | null
  initialType: string | null
}

export default function LineChart({
  allPurchase,
  allConsume,
  initialYear,
  initialType,
}: ChartDataProps) {
  const [isPurchase, setIsPurchase] = useState(false)
  const [isConsume, setIsConsume] = useState(false)

  const allYears = [
    2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018,
    2019, 2020, 2021, 2022, 2023,
  ]

  const allMonths = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ]

  const options = {
    chart: {
      type: 'spline',
    },
    title: {
      text: '구매 사용 그래프',
      align: 'center',
    },
    xAxis: {
      categories: initialYear === 'null' ? allYears : allMonths,
    },
    yAxis: {
      title: {
        text: '',
      },
    },
    tooltip: {
      enabled: true,
      shared: true,
    },
    plotOptions: {
      series: {
        label: {
          connectorAllowed: false,
        },
      },
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: '구매',
        data: isConsume ? [] : allPurchase,
      },
      {
        name: '사용',
        data: isPurchase ? [] : allConsume,
      },
    ],
  }

  useEffect(() => {
    if (JSON.parse(initialType || 'null') === 'purchase') {
      setIsPurchase(true)
    } else {
      setIsPurchase(false)
    }
  }, [initialType])

  useEffect(() => {
    if (JSON.parse(initialType || 'null') === 'consume') {
      setIsConsume(true)
    } else {
      setIsConsume(false)
    }
  }, [initialType])

  return (
    <>
      <div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </>
  )
}
