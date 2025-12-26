// src/services/itemsDiscount.service.ts
import {
  findAllItemsDiscount,
  findItemsDiscountById,
  createItemsDiscountDB,
  updateItemsDiscountDB,
  removeItemsDiscountDB,
} from "../db/promotion.db";
import { ItemsDiscount } from "../entity/ItemDiscount";

// ===== OUTPUT DTO =====
export interface ItemsDiscountDto {
  id?: number;
  itemId?: number;
  title?: string;
  discountAmount?: number;
  startAt?: string;
  endAt?: string;
}

// ===== INPUT DTO =====
export interface CreateItemsDiscountInput {
  itemId: number;
  title?: string;
  discountAmount: number;
  startAt?: string;
  endAt?: string;
}

export interface UpdateItemsDiscountInput {
  title?: string;
  discountAmount?: number;
  startAt?: string;
  endAt?: string;
}

// ===== VALIDATION =====
const validateDiscount = (data: {
  discountAmount?: number;
  startAt?: string;
  endAt?: string;
}) => {
  if (data.discountAmount !== undefined) {
    if (data.discountAmount < 0 || data.discountAmount > 100) {
      throw new Error("INVALID_DISCOUNT_AMOUNT");
    }
  }

  if (data.startAt && data.endAt) {
    if (new Date(data.endAt) <= new Date(data.startAt)) {
      throw new Error("INVALID_DATE_RANGE");
    }
  }
};

// ===== MAP ENTITY → DTO =====
const toDto = (entity: ItemsDiscount): ItemsDiscountDto => ({
  id: entity.id,
  itemId: entity.item.id,
  title: entity.title ?? undefined,
  discountAmount: entity.discountAmount ?? undefined,
  startAt: entity.startAt ? entity.startAt.toISOString() : undefined,
  endAt: entity.endAt ? entity.endAt.toISOString() : undefined,
});

// ===== GET ALL =====
export const getAllItemsDiscount = async (): Promise<ItemsDiscountDto[]> => {
  const entities = await findAllItemsDiscount();
  return entities.map(toDto);
};

// ===== GET ONE =====
export const getOneItemsDiscount = async (id: number): Promise<ItemsDiscountDto> => {
  const entity = await findItemsDiscountById(id);
  if (!entity) throw new Error("DISCOUNT_NOT_FOUND");
  return toDto(entity);
};

// ===== CREATE =====
export const createItemsDiscount = async (
  data: CreateItemsDiscountInput
): Promise<ItemsDiscountDto> => {
  validateDiscount(data);

  const saved = await createItemsDiscountDB({
    itemId: data.itemId,
    title: data.title,
    discountAmount: data.discountAmount,
    startAt: data.startAt ? new Date(data.startAt) : null,
    endAt: data.endAt ? new Date(data.endAt) : null,
  });

  if (!saved) throw new Error("ITEM_NOT_FOUND");

  return toDto(saved);
};

// ===== UPDATE =====
export const updateItemsDiscount = async (
  id: number,
  data: UpdateItemsDiscountInput
): Promise<ItemsDiscountDto> => {
  validateDiscount(data);

  const entity = await findItemsDiscountById(id);
  if (!entity) throw new Error("DISCOUNT_NOT_FOUND");

  if (data.title !== undefined) entity.title = data.title;
  if (data.discountAmount !== undefined)
    entity.discountAmount = data.discountAmount;
  if (data.startAt !== undefined)
    entity.startAt = data.startAt ? new Date(data.startAt) : null;
  if (data.endAt !== undefined)
    entity.endAt = data.endAt ? new Date(data.endAt) : null;

  const updated = await updateItemsDiscountDB(entity);
  return toDto(updated);
};

// ===== DELETE =====
export const removeItemsDiscount = async (id: number): Promise<void> => {
  const entity = await findItemsDiscountById(id);
  if (!entity) throw new Error("DISCOUNT_NOT_FOUND");
  await removeItemsDiscountDB(entity);
};
