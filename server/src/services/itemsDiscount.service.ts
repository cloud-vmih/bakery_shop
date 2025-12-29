import {
  findAllItemsDiscount,
  findItemsDiscountById,
  createItemsDiscountDB,
  updateItemsDiscountDB,
  removeItemsDiscountDB,
} from "../db/promotion.db";
import { ItemsDiscount } from "../entity/ItemDiscount";

export interface ItemsDiscountDto {
  id?: number;
  itemIds?: number[]; 
  title?: string;
  discountAmount?: number;
  startAt?: string;
  endAt?: string;
}

export interface CreateItemsDiscountInput {
  itemIds: number[]; 
  title?: string;
  discountAmount: number;
  startAt?: string;
  endAt?: string;
}

export interface UpdateItemsDiscountInput {
  itemIds?: number[];  
  title?: string;
  discountAmount?: number;
  startAt?: string;
  endAt?: string;
}

const validateDiscount = (data: {
  discountAmount?: number;
  itemIds?: number[];
  startAt?: string;
  endAt?: string;
}) => {
  if (data.discountAmount !== undefined) {
    if (data.discountAmount < 0 || data.discountAmount > 100) {
      throw new Error("INVALID_DISCOUNT_AMOUNT");
    }
  }

  if (data.itemIds !== undefined && (!Array.isArray(data.itemIds) || data.itemIds.length === 0)) {  
    throw new Error("ITEMS_NOT_FOUND");
  }

  if (data.startAt && data.endAt) {
    if (new Date(data.endAt) <= new Date(data.startAt)) {
      throw new Error("INVALID_DATE_RANGE");
    }
  }
};

const toDto = (entity: ItemsDiscount): ItemsDiscountDto => ({
  id: entity.id,
  itemIds: entity.items ? entity.items.map(i => i.id).filter((id): id is number => id !== undefined) : [], 
  title: entity.title ?? undefined,
  discountAmount: entity.discountAmount ?? undefined,
  startAt: entity.startAt ? entity.startAt.toISOString() : undefined,
  endAt: entity.endAt ? entity.endAt.toISOString() : undefined,
});

export const getAllItemsDiscount = async (): Promise<ItemsDiscountDto[]> => {
  const entities = await findAllItemsDiscount();
  return entities.map(toDto);
};

export const getOneItemsDiscount = async (id: number): Promise<ItemsDiscountDto> => {
  const entity = await findItemsDiscountById(id);
  if (!entity) throw new Error("DISCOUNT_NOT_FOUND");
  return toDto(entity);
};

export const createItemsDiscount = async (
  data: CreateItemsDiscountInput
): Promise<ItemsDiscountDto> => {
  validateDiscount(data);

  const saved = await createItemsDiscountDB({
    itemIds: data.itemIds,  
    title: data.title,
    discountAmount: data.discountAmount,
    startAt: data.startAt ? new Date(data.startAt) : null,
    endAt: data.endAt ? new Date(data.endAt) : null,
  });

  if (!saved) throw new Error("ITEMS_NOT_FOUND");  

  return toDto(saved);  
};
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

  const updated = await updateItemsDiscountDB(entity, data.itemIds);

  if (!updated) throw new Error("UPDATE_FAILED");

  return toDto(updated);
};

export const removeItemsDiscount = async (id: number): Promise<void> => {
  const entity = await findItemsDiscountById(id);
  if (!entity) throw new Error("DISCOUNT_NOT_FOUND");
  await removeItemsDiscountDB(entity);
};
