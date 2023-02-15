import { Form } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import SearchArea, { SearchAreaForm } from '../SearchArea'
import EquipmentTable from '../tables/EquipmentTable'

const EquipmentTab = () => {
  const [form] = useForm<SearchAreaForm>()

  const name = Form.useWatch('name', form)
  const labels = Form.useWatch('labels', form)

  return (
    <>
      <SearchArea form={form} type={'EQUIPMENT'} />
      <EquipmentTable name={name} labels={labels} />
    </>
  )
}

export default EquipmentTab
