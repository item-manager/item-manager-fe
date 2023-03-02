import { Col, Row } from 'antd'
import { useState } from 'react'
import PlaceTable from './tables/PlaceTable'
import RoomTable from './tables/RoomTable'

const LocationsPage = () => {
  const [roomNo, setRoomNo] = useState<number | undefined>()

  return (
    <Row gutter={20}>
      <Col span={12}>
        <RoomTable roomNo={roomNo} setRoomNo={(roomNo) => setRoomNo(roomNo)} />
      </Col>
      <Col span={12}>
        <PlaceTable roomNo={roomNo} />
      </Col>
    </Row>
  )
}
export default LocationsPage
