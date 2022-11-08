import {ConnectionInterface} from '@/Database/Connections/ArangoConnection';
import moment from 'moment';

export const up = (connection: ConnectionInterface) => {
  const now = moment();
  const categoryData = {
    "id": "6ee638cd-0a62-43cc-ab59-2621a94de52a",
    "name": "Architectural material",
    "subs": [
      {
        "id": "77ddded3-2161-40f8-948b-e3a57bd3ce55",
        "name": "Architectural Metal & Alloy",
        "subs": [
          {
            "id": "7d675b80-42d0-4f65-beed-bc250334d5b9",
            "name": "Aluminum"
          },
          {
            "id": "a1517e2d-36c3-44ac-9aa2-02b58c2add69",
            "name": "Brass"
          },
          {
            "id": "6cfe986e-a2fd-456e-9122-0f144c09c5de",
            "name": "Bronze"
          },
          {
            "id": "60503046-5eea-4c67-aa28-02e9c899ee95",
            "name": "Cold/Hot Rolled Steel"
          }
        ]
      },
      {
        "id": "56a024e1-280b-4b84-851e-b5f58e7b4468",
        "name": "Natural Stone & Rock",
        "subs": [
          {
            "id": "7bcb90a4-0149-487b-ac3d-1f35601b1056",
            "name": "Basalt"
          },
          {
            "id": "1425bb8b-505a-46ae-b4de-cdff4fae97f4",
            "name": "Grannite"
          },
          {
            "id": "06074e5a-b3be-476d-8caf-ece73a160db5",
            "name": "Limestone"
          },
          {
            "id": "30d0d6c1-eac3-4b2e-ba62-d2f08fc7e840",
            "name": "Marble"
          }
        ]
      }
    ],
    "created_at": now,
    "updated_at": now,
    "deleted_at": null
  }
  return connection.insert(
    'categories', categoryData
  );
}
