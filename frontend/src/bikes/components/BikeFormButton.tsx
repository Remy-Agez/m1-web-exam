import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Checkbox,
  Col,
  Input,
  InputNumber,
  Modal,
  Row,
  Typography,
} from "antd";
import { useState } from "react";
import type { BikeModel, CreateBikeModel } from "../models/BikeModel";

interface BikeFormButtonProps {
  // With a bike the modal edits it, without one it creates a new bike
  bike?: BikeModel;
  saveBike: (input: CreateBikeModel) => Promise<void>;
}

type TextField =
  "brand" | "model" | "description" | "category" | "frameMaterial";

type NumberField =
  "frameSizeCm" | "wheelSizeInches" | "gearCount" | "weightKg" | "priceEuros";

type BikeFormValues = Record<TextField, string> &
  Record<NumberField, number | null> & { electric: boolean };

type BikeFormErrors = Partial<Record<TextField | NumberField, string>>;

// Suggestions only: the API accepts any category or material
const categories = ["road", "mountain", "gravel", "city", "hybrid"];
const frameMaterials = ["aluminium", "carbon", "steel"];

const emptyValues: BikeFormValues = {
  brand: "",
  model: "",
  description: "",
  category: "",
  frameMaterial: "",
  frameSizeCm: null,
  wheelSizeInches: null,
  gearCount: null,
  weightKg: null,
  priceEuros: null,
  electric: false,
};

const toValues = (bike?: BikeModel): BikeFormValues =>
  bike ? { ...bike, priceEuros: bike.priceCents / 100 } : emptyValues;

const validate = (values: BikeFormValues): BikeFormErrors => {
  const errors: BikeFormErrors = {};
  if (!values.brand.trim()) errors.brand = "Brand is required";
  if (!values.model.trim()) errors.model = "Model is required";
  if (!values.description.trim())
    errors.description = "Description is required";
  if (!values.category.trim()) errors.category = "Category is required";
  if (!values.frameMaterial.trim())
    errors.frameMaterial = "Frame material is required";

  const positive = (name: NumberField, label: string) => {
    const value = values[name];
    if (value === null) errors[name] = `${label} is required`;
    else if (value <= 0) errors[name] = `${label} must be greater than 0`;
  };
  positive("frameSizeCm", "Frame size");
  positive("wheelSizeInches", "Wheel size");
  positive("weightKg", "Weight");

  if (values.gearCount === null) errors.gearCount = "Gear count is required";
  else if (!Number.isInteger(values.gearCount) || values.gearCount < 1)
    errors.gearCount = "Gear count must be a whole number of at least 1";

  if (values.priceEuros === null) errors.priceEuros = "Price is required";
  else if (values.priceEuros < 0)
    errors.priceEuros = "Price cannot be negative";
  return errors;
};

// Only called once validate() passed, so every number is set
const toCreateBikeModel = (values: BikeFormValues): CreateBikeModel => ({
  brand: values.brand.trim(),
  model: values.model.trim(),
  description: values.description.trim(),
  category: values.category.trim(),
  frameMaterial: values.frameMaterial.trim(),
  frameSizeCm: values.frameSizeCm!,
  wheelSizeInches: values.wheelSizeInches!,
  gearCount: values.gearCount!,
  weightKg: values.weightKg!,
  electric: values.electric,
  // The API stores prices in cents
  priceCents: Math.round(values.priceEuros! * 100),
});

export const BikeFormButton = ({ bike, saveBike }: BikeFormButtonProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [values, setValues] = useState<BikeFormValues>(emptyValues);
  const [errors, setErrors] = useState<BikeFormErrors>({});
  const [saveError, setSaveError] = useState<string | null>(null);

  const open = () => {
    setValues(toValues(bike));
    setIsOpen(true);
  };

  const close = () => {
    setValues(emptyValues);
    setErrors({});
    setSaveError(null);
    setIsOpen(false);
  };

  const onConfirm = () => {
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSaving(true);
    setSaveError(null);
    saveBike(toCreateBikeModel(values))
      .then(close)
      // On failure, keep the modal open so the changes are not lost
      .catch(() => setSaveError("The bike could not be saved, please retry"))
      .finally(() => setIsSaving(false));
  };

  const setValue = <K extends keyof BikeFormValues>(
    name: K,
    value: BikeFormValues[K],
  ) => {
    setValues({ ...values, [name]: value });
    if (name !== "electric") setErrors({ ...errors, [name]: undefined });
  };

  const error = (name: TextField | NumberField) =>
    errors[name] && (
      <Typography.Text type="danger">{errors[name]}</Typography.Text>
    );

  const textField = (name: TextField, label: string) => (
    <>
      <label htmlFor={`bike-${name}`}>{label}</label>
      <Input
        id={`bike-${name}`}
        value={values[name]}
        status={errors[name] && "error"}
        onChange={(event) => setValue(name, event.target.value)}
      />
      {error(name)}
    </>
  );

  const suggestionField = (
    name: "category" | "frameMaterial",
    label: string,
    suggestions: string[],
  ) => (
    <>
      <label htmlFor={`bike-${name}`}>{label}</label>
      <AutoComplete
        id={`bike-${name}`}
        style={{ width: "100%" }}
        options={suggestions.map((value) => ({ value }))}
        value={values[name]}
        status={errors[name] && "error"}
        onChange={(value) => setValue(name, value)}
      />
      {error(name)}
    </>
  );

  const numberField = (
    name: NumberField,
    label: string,
    suffix: string,
    precision?: number,
  ) => (
    <>
      <label htmlFor={`bike-${name}`}>{label}</label>
      <InputNumber
        id={`bike-${name}`}
        style={{ width: "100%" }}
        min={0}
        precision={precision}
        suffix={suffix}
        value={values[name]}
        status={errors[name] && "error"}
        onChange={(value) => setValue(name, value)}
      />
      {error(name)}
    </>
  );

  return (
    <>
      {bike ? (
        <Button icon={<EditOutlined />} aria-label="Edit bike" onClick={open} />
      ) : (
        <Button type="primary" icon={<PlusOutlined />} onClick={open}>
          Add bike
        </Button>
      )}
      <Modal
        open={isOpen}
        title={bike ? `Editing ${bike.brand} ${bike.model}` : "New bike"}
        okText={bike ? "Save" : "Add bike"}
        onCancel={close}
        onOk={onConfirm}
        confirmLoading={isSaving}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>{textField("brand", "Brand *")}</Col>
          <Col span={12}>{textField("model", "Model *")}</Col>
          <Col span={12}>
            {suggestionField("category", "Category *", categories)}
          </Col>
          <Col span={12}>
            {suggestionField(
              "frameMaterial",
              "Frame material *",
              frameMaterials,
            )}
          </Col>
          <Col span={24}>
            <label htmlFor="bike-description">Description *</label>
            <Input.TextArea
              id="bike-description"
              rows={3}
              value={values.description}
              status={errors.description && "error"}
              onChange={(event) => setValue("description", event.target.value)}
            />
            {error("description")}
          </Col>
          <Col span={8}>{numberField("frameSizeCm", "Frame size *", "cm")}</Col>
          <Col span={8}>
            {numberField("wheelSizeInches", "Wheel size *", "in")}
          </Col>
          <Col span={8}>{numberField("gearCount", "Gears *", "", 0)}</Col>
          <Col span={8}>{numberField("weightKg", "Weight *", "kg")}</Col>
          <Col span={8}>{numberField("priceEuros", "Price *", "€", 2)}</Col>
          <Col span={8} style={{ alignSelf: "flex-end" }}>
            <Checkbox
              checked={values.electric}
              onChange={(event) => setValue("electric", event.target.checked)}
            >
              Electric
            </Checkbox>
          </Col>
          {saveError && (
            <Col span={24}>
              <Typography.Text type="danger">{saveError}</Typography.Text>
            </Col>
          )}
        </Row>
      </Modal>
    </>
  );
};
