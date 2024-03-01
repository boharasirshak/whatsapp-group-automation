export type CreatedCustomer = {
  name: string;
  phone: string;
  id?: string;
  joined?: boolean = false;
}

export type CreatedGroup = {
  id: string;
  title: string;
  customerType?: string;
  customers?: CreatedCustomer[];
  brandName?: string;
  link1?: string;
  link2?: string;
  date1?: string;
  date2?: string;
  time?: string;
  props?: string;
  messageType?: string;
};

export type GroupNotificationId = {
  fromMe: boolean;
  remote: string;
  id: string;
  participant: string;
  _serialized: string;
}
