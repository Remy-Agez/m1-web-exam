import {
  AppstoreOutlined,
  EyeOutlined,
  TagOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Col, Row, Space } from "antd";
import { ButtonLink } from "../../shared/components/ButtonLink";
import { ListItem } from "../../shared/components/ListItem";
import { formatPrice } from "../../shared/formatPrice";
import type { BikeModel } from "../models/BikeModel";
import { DeleteBikeButton } from "./DeleteBikeButton";

interface BikeListItemProps {
  bike: BikeModel;
  deleteBike: (id: string) => Promise<void>;
}

export const BikeListItem = ({ bike, deleteBike }: BikeListItemProps) => {
  return (
    <ListItem>
      <Col span={10}>
        <Space orientation="horizontal" style={{ width: "100%" }}>
          <AppstoreOutlined />
          {`${bike.brand} ${bike.model}`}
          {bike.electric && <ThunderboltOutlined aria-label="Electric" />}
        </Space>
      </Col>
      <Col span={8}>
        <Space orientation="horizontal" style={{ width: "100%" }}>
          <TagOutlined />
          {`${bike.category} · ${bike.frameMaterial}`}
        </Space>
      </Col>
      <Col span={4} style={{ textAlign: "right", fontWeight: "bold" }}>
        {formatPrice(bike.priceCents)}
      </Col>
      <Col span={2}>
        <Row gutter={[4, 4]} justify="end">
          <Col>
            <ButtonLink
              to="/bikes/$bikeId"
              params={{ bikeId: bike.id }}
              aria-label={`See ${bike.brand} ${bike.model}`}
            >
              <EyeOutlined />
            </ButtonLink>
          </Col>
          <Col>
            <DeleteBikeButton bike={bike} deleteBike={deleteBike} />
          </Col>
        </Row>
      </Col>
    </ListItem>
  );
};
