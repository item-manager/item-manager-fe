import { Col, Grid, Row } from 'antd'
import { useState } from 'react'
import PlaceTable from './tables/PlaceTable'
import RoomTable from './tables/RoomTable'

const LocationsPage = () => {
  const [roomNo, setRoomNo] = useState<number | undefined>()

  const breakpoint = Grid.useBreakpoint()

  return breakpoint.md ? (
    <Row gutter={[20, 20]}>
      <Col span={12}>
        <RoomTable roomNo={roomNo} setRoomNo={(roomNo) => setRoomNo(roomNo)} />
      </Col>
      <Col span={12}>
        <PlaceTable roomNo={roomNo} />
      </Col>
    </Row>
  ) : (
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <RoomTable roomNo={roomNo} setRoomNo={(roomNo) => setRoomNo(roomNo)} />
      </Col>
      <Col span={24}>
        <PlaceTable roomNo={roomNo} />
      </Col>
    </Row>
  )
}
export default LocationsPage
