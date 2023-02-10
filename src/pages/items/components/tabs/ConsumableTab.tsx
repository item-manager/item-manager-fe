import { Form } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import SearchArea, { SearchAreaForm } from '../SearchArea'
import ConsumableTable from '../tables/ConsumableTable'

const ConsumableTab = () => {
  const [form] = useForm<SearchAreaForm>()

  const name = Form.useWatch('name', form)
  const temp1 = Form.useWatch('temp1', form)

  return (
    <>
      <SearchArea form={form} />
      <ConsumableTable name={name} temp1={temp1} />
    </>
  )
}

export default ConsumableTab
