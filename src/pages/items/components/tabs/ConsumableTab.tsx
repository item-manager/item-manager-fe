import { Form } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import SearchArea, { SearchAreaForm } from '../SearchArea'
import ConsumableTable from '../tables/ConsumableTable'

const ConsumableTab = () => {
  const [form] = useForm<SearchAreaForm>()

  const name = Form.useWatch('name', form)
  const labels = Form.useWatch('labels', form)

  return (
    <>
      <SearchArea form={form} type={'CONSUMABLE'} />
      <ConsumableTable name={name} labels={labels} />
    </>
  )
}

export default ConsumableTab
