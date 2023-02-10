import { Form } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import SearchArea, { SearchAreaForm } from '../SearchArea'
import EquipmentTable from '../tables/EquipmentTable'

const EquipmentTab = () => {
  const [form] = useForm<SearchAreaForm>()

  const name = Form.useWatch('name', form)
  const temp1 = Form.useWatch('temp1', form)

  return (
    <>
      <SearchArea form={form} />
      <EquipmentTable name={name} temp1={temp1} />
    </>
  )
}

export default EquipmentTab
