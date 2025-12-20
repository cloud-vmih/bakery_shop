import { AppDataSource } from "../config/database";
import { Payment } from "../entity/Payment";
import { Order } from "../entity/Orders";
import { EPayment, EPayStatus } from "../entity/enum/enum";

export const createPaymentDB = async (order: Order, method: EPayment) => {
  const repo = AppDataSource.getRepository(Payment);

  const payment = repo.create({
    order,
    paymentMethod: method,
    status: EPayStatus.PENDING,
    createAt: new Date(),
  });

  return await repo.save(payment);
};

export const findPaymentByOrderIdDB = async (orderId: number) => {
  const repo = AppDataSource.getRepository(Payment);

  return await repo.findOne({
    where: { order: { id: orderId } as any },
    relations: ["order"],
  });
};
