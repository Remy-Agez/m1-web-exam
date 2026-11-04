import { DeleteOutlined } from "@ant-design/icons";
import { Button, Modal, Space, Typography } from "antd";
import { isAxiosError } from "axios";
import { useState } from "react";
import type { BikeModel } from "../models/BikeModel";

const soldMessage = "This bike has already been sold and cannot be deleted";

interface DeleteBikeButtonProps {
  bike: BikeModel;
  deleteBike: (id: string) => Promise<void>;
}

export const DeleteBikeButton = ({
  bike,
  deleteBike,
}: DeleteBikeButtonProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const onCancel = () => {
    setError(null);
    setIsOpen(false);
  };

  const onConfirm = () => {
    setIsDeleting(true);
    deleteBike(bike.id)
      .then(onCancel)
      .catch((error) => {
        // The API refuses to delete a bike that is part of a sale (409)
        setError(
          isAxiosError(error) && error.response?.status === 409
            ? soldMessage
            : "The bike could not be deleted, please retry",
        );
      })
      .finally(() => setIsDeleting(false));
  };

  return (
    <>
      <Button
        danger
        aria-label={`Delete ${bike.brand} ${bike.model}`}
        onClick={() => setIsOpen(true)}
      >
        <DeleteOutlined />
      </Button>
      <Modal
        okButtonProps={{ danger: true, disabled: error === soldMessage }}
        open={isOpen}
        title={`Deleting ${bike.brand} ${bike.model}`}
        onCancel={onCancel}
        onOk={onConfirm}
        okText="Yes, delete"
        confirmLoading={isDeleting}
      >
        <Space orientation="vertical">
          <span>
            You are about to delete the bike {bike.brand} {bike.model}. This
            action cannot be undone, are you sure ?
          </span>
          {error && <Typography.Text type="danger">{error}</Typography.Text>}
        </Space>
      </Modal>
    </>
  );
};
