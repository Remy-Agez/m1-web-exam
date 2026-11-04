import { Empty, Pagination, Skeleton, Space } from "antd";
import { useEffect } from "react";
import {
  CUSTOMERS_PAGE_SIZE,
  useCustomersProvider,
} from "../providers/useCustomersProvider";
import { AddCustomerButton } from "./AddCustomerButton";
import { CustomerListItem } from "./CustomerListItem";

export const CustomersList = () => {
  const {
    customers,
    totalCount,
    page,
    deleteCustomer,
    createCustomer,
    isLoading,
    hasError,
    load,
  } = useCustomersProvider();

  useEffect(() => {
    load(1);
  }, []);

  return (
    <Space orientation="vertical" style={{ padding: ".25rem .5rem" }}>
      <AddCustomerButton createCustomer={createCustomer} />
      {isLoading ? (
        <Skeleton />
      ) : hasError ? (
        <Empty description="The customers could not be loaded, please try again later" />
      ) : (
        customers.map((customer) => (
          <CustomerListItem
            key={customer.id}
            customer={customer}
            deleteCustomer={deleteCustomer}
          />
        ))
      )}
      <Pagination
        current={page}
        pageSize={CUSTOMERS_PAGE_SIZE}
        total={totalCount}
        showSizeChanger={false}
        showTotal={(total) => `${total} customers`}
        onChange={(newPage) => load(newPage)}
        disabled={isLoading}
      />
    </Space>
  );
};
