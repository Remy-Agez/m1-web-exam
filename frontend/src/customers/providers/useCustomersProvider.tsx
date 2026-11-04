import axios from "axios";
import { useState } from "react";
import type {
  CreateCustomerModel,
  CustomerModel,
  CustomersPageModel,
} from "../models/CustomerModel";

export const CUSTOMERS_PAGE_SIZE = 10;

export const useCustomersProvider = () => {
  const [customers, setCustomers] = useState<CustomerModel[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const load = (requestedPage: number = page) => {
    setIsLoading(true);
    setHasError(false);
    axios
      .get<CustomersPageModel>("http://localhost:3000/customers", {
        params: { page: requestedPage, limit: CUSTOMERS_PAGE_SIZE },
      })
      .then((result) => {
        const lastPage = Math.max(
          1,
          Math.ceil(result.data.totalCount / CUSTOMERS_PAGE_SIZE),
        );
        // The page became empty (e.g. after deleting its last customer): show the new last page
        if (requestedPage > lastPage) {
          load(lastPage);
          return;
        }
        setPage(requestedPage);
        setCustomers(result.data.customers);
        setTotalCount(result.data.totalCount);
        setIsLoading(false);
      })
      .catch(() => {
        setHasError(true);
        setIsLoading(false);
      });
  };

  // Deleting changes the page content and the total: reload the current page
  const deleteCustomer = (id: string) => {
    axios.delete(`http://localhost:3000/customers/${id}`).then(() => load());
  };

  // Returns the request so the caller can react to errors (e.g. email already in use)
  const createCustomer = (input: CreateCustomerModel) =>
    axios
      .post<CustomerModel>("http://localhost:3000/customers", input)
      .then(() => load());

  return {
    customers,
    totalCount,
    page,
    load,
    isLoading,
    hasError,
    deleteCustomer,
    createCustomer,
  };
};
