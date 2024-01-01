import { NatsConnection } from "nats";
import { CertCommandPayloadNATS, CertCommandStatus } from "../types";

export function statusUpdate(
  natsConnection: NatsConnection,
  subject: string,
  payload: CertCommandPayloadNATS & { status: CertCommandStatus }
): void {
  const { clientName, status } = payload;
  natsConnection.publish(
    `${subject}.update`,
    JSON.stringify({ clientName, status })
  );
}
