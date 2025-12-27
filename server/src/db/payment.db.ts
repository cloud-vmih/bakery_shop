import { AppDataSource } from "../config/database";
import { Payment } from "../entity/Payment";
import { EPayment, EPayStatus } from "../entity/enum/enum";

export const createPaymentDB = async (orderId: number, method: EPayment) => {
  const repo = AppDataSource.getRepository(Payment);
  return repo.save(
    repo.create({
      order: { id: orderId } as any,
      paymentMethod: method,
      status: EPayStatus.PENDING,
      createAt: new Date(),
    })
  );
};

export const findPaymentByOrderIdDB = async (orderId: number) => {
  return AppDataSource.getRepository(Payment).findOne({
    where: { order: { id: orderId } as any },
    relations: ["order"],
  });
};

export const updatePaymentStatusDB = async (
  orderId: number,
  status: EPayStatus
) => {
  const repo = AppDataSource.getRepository(Payment);
  const payment = await findPaymentByOrderIdDB(orderId);
  if (!payment) throw new Error("Payment not found");
  payment.status = status;
  return repo.save(payment);
};
