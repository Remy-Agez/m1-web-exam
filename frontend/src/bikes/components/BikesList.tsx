import { Empty, Pagination, Skeleton, Space } from "antd";
import { useEffect, useState } from "react";
import type { CreateBikeModel } from "../models/BikeModel";
import {
  BIKES_PAGE_SIZE,
  useBikesProvider,
} from "../providers/useBikesProvider";
import { BikeFormButton } from "./BikeFormButton";
import { BikeListItem } from "./BikeListItem";

export const BikesList = () => {
  const {
    bikes,
    totalCount,
    createBike,
    deleteBike,
    isLoading,
    hasError,
    load,
  } = useBikesProvider();
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    load(page);
  }, [page]);

  // Reload the current page so the totals and the page content stay in sync
  const onCreate = (input: CreateBikeModel) =>
    createBike(input).then(() => load(page));

  const onDelete = (id: string) =>
    deleteBike(id).then(() => {
      // The last bike of the page is gone: show the previous page instead
      if (bikes.length === 1 && page > 1) setPage(page - 1);
      else load(page);
    });

  return (
    <Space orientation="vertical" style={{ padding: ".25rem .5rem" }}>
      <BikeFormButton saveBike={onCreate} />
      {isLoading ? (
        <Skeleton />
      ) : hasError ? (
        <Empty description="The bikes could not be loaded, please try again later" />
      ) : bikes.length === 0 ? (
        <Empty description="No bikes in the catalogue yet" />
      ) : (
        bikes.map((bike) => (
          <BikeListItem key={bike.id} bike={bike} deleteBike={onDelete} />
        ))
      )}
      <Pagination
        current={page}
        pageSize={BIKES_PAGE_SIZE}
        total={totalCount}
        showSizeChanger={false}
        showTotal={(total) => `${total} bikes`}
        onChange={setPage}
        disabled={isLoading}
      />
    </Space>
  );
};
