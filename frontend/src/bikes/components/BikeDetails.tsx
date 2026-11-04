import {
  AppstoreOutlined,
  ArrowLeftOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import type { DescriptionsProps } from "antd";
import { Card, Descriptions, Skeleton, Space } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { ButtonLink } from "../../shared/components/ButtonLink";
import { formatPrice } from "../../shared/formatPrice";
import { useBikeDetailsProvider } from "../providers/useBikeDetailsProvider";
import { BikeFormButton } from "./BikeFormButton";

interface BikeDetailsProps {
  bikeId: string;
}

export const BikeDetails = ({ bikeId }: BikeDetailsProps) => {
  const { bike, isLoading, load, updateBike } = useBikeDetailsProvider(bikeId);

  useEffect(() => {
    load();
  }, [bikeId]);

  const value = (content: ReactNode) =>
    isLoading ? <Skeleton.Input active size="small" /> : (content ?? "—");

  const items: DescriptionsProps["items"] = [
    { key: "category", label: "Category", children: value(bike?.category) },
    {
      key: "frameMaterial",
      label: "Frame material",
      children: value(bike?.frameMaterial),
    },
    {
      key: "frameSizeCm",
      label: "Frame size",
      children: value(bike && `${bike.frameSizeCm} cm`),
    },
    {
      key: "wheelSizeInches",
      label: "Wheel size",
      children: value(bike && `${bike.wheelSizeInches} in`),
    },
    { key: "gearCount", label: "Gears", children: value(bike?.gearCount) },
    {
      key: "weightKg",
      label: "Weight",
      children: value(bike && `${bike.weightKg} kg`),
    },
    {
      key: "electric",
      label: (
        <Space>
          <ThunderboltOutlined />
          Electric
        </Space>
      ),
      children: value(bike && (bike.electric ? "Yes" : "No")),
    },
    {
      key: "price",
      label: "Price",
      children: value(bike && <strong>{formatPrice(bike.priceCents)}</strong>),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 16,
        padding: ".25rem .5rem",
      }}
    >
      <ButtonLink to="/bikes" icon={<ArrowLeftOutlined />}>
        Back to bikes
      </ButtonLink>

      <Space align="center">
        <AppstoreOutlined style={{ fontSize: "1.5rem" }} />
        {isLoading ? (
          <Skeleton.Input active size="large" />
        ) : (
          <Title level={2} style={{ margin: 0 }}>
            {bike ? `${bike.brand} ${bike.model}` : "Bike not found"}
          </Title>
        )}
      </Space>

      {(isLoading || bike) && (
        <Card
          title="Specifications"
          style={{ alignSelf: "stretch" }}
          extra={bike && <BikeFormButton bike={bike} saveBike={updateBike} />}
        >
          {isLoading ? (
            <Skeleton active paragraph={{ rows: 1 }} title={false} />
          ) : (
            <Paragraph>{bike?.description}</Paragraph>
          )}
          <Descriptions column={{ xs: 1, md: 2 }} items={items} />
        </Card>
      )}
    </div>
  );
};
