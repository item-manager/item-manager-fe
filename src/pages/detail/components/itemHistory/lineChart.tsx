import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useEffect, useState } from 'react'

interface ChartDataProps {
  allPurchase: number[]
  allConsume: number[]
  initialYear: string | null
  initialType: string | null
  allPurchaseYears?: number[]
  allConsumeYears?: number[]
}

export default function LineChart({
  allPurchase,
  allConsume,
  initialYear,
  initialType,
  allPurchaseYears,
  allConsumeYears,
}: ChartDataProps) {
  const [isPurchase, setIsPurchase] = useState(false)
  const [isConsume, setIsConsume] = useState(false)

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

  const xAxis = () => {
    if (
      initialYear === null ||
      initialYear === 'null' ||
      initialType === null ||
      initialType === '"purchase"' ||
      initialType === '"consume"'
    ) {
      return initialType === '"purchase"' ? allPurchaseYears : allConsumeYears
    } else {
      return allMonths
    }
  }

  const options = {
    chart: {
      type: 'spline',
    },
    title: {
      text: '구매 사용 그래프',
      align: 'center',
    },
    xAxis: {
      categories: xAxis(),
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
