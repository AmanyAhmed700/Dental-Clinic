/*
  Warnings:

  - A unique constraint covering the columns `[userId,appointmentId,type]` on the table `notification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "notification_userId_appointmentId_type_key" ON "notification"("userId", "appointmentId", "type");
