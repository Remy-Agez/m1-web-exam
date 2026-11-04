import axios from "axios";
import { useState } from "react";
import type {
  BikeModel,
  BikesPageModel,
  CreateBikeModel,
} from "../models/BikeModel";

export const BIKES_PAGE_SIZE = 10;

export const useBikesProvider = () => {
  const [bikes, setBikes] = useState<BikeModel[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const load = (page: number) => {
    setIsLoading(true);
    setHasError(false);
    axios
      .get<BikesPageModel>("http://localhost:3000/bikes", {
        params: { page, limit: BIKES_PAGE_SIZE },
      })
      .then((result) => {
        setBikes(result.data.bikes);
        setTotalCount(result.data.totalCount);
      })
      .catch(() => setHasError(true))
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Both return the request: the caller reloads the page and handles errors
  // (e.g. 409 when the bike has already been sold)
  const createBike = (input: CreateBikeModel) =>
    axios.post<BikeModel>("http://localhost:3000/bikes", input).then(() => {});

  const deleteBike = (id: string) =>
    axios.delete(`http://localhost:3000/bikes/${id}`).then(() => {});

  return {
    bikes,
    totalCount,
    load,
    isLoading,
    hasError,
    createBike,
    deleteBike,
  };
};
