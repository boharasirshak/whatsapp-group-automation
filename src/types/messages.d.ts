import {
  Buttons,
  Client,
  Contact,
  List,
  Location,
  MessageSendOptions
} from "whatsapp-web.js";

// In case you want to expand the functionality, 
// I have commented some code which might be useful

// export enum TargetType {
//   Private = "private",
//   Group = "group",
// }

// interface Target {
//   type: TargetChat
//   id: string;
// }

export type ISendMessage = {
  client: Client;
  message: string;
  chatId: string;
  options?: MessageSendOptions = {};
};

export type ISendFile = {
  client: Client;
  chatId: string;
  caption: string;
  file: Express.Multer.File;
  options?: MessageSendOptions = {};
};

export type ISendLocation = {
  client: Client;
  chatId: string;
  location: Location;
  options?: MessageSendOptions = {};
};

export type ISendContact = {
  client: Client;
  chatId: string;
  contacts: Contact[];
  options?: MessageSendOptions = {};
};

export type ISendButtons = {
  client: Client;
  chatId: string;
  buttons: Buttons;
  options?: MessageSendOptions = {};
};

export type ISendList = {
  client: Client;
  chatId: string;
  list: List;
  options?: MessageSendOptions = {};
};
