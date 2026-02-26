# College Exam Seat Planner

> A MERN Stack app that allocates classrooms for exams using a greedy algorithm — minimum rooms, lower floors first.

---

## Folder Structure

```
exam-seat-planner/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/Classroom.js
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── utils/
└── package.json
```

---

## Data Model

```js
{
  roomId:       String,
  capacity:     Number,
  floorNo:      Number,   // 0 = Ground Floor
  nearWashroom: Boolean,
}
```

---

## API

| Method | Endpoint                   | Body                                        | Description     |
|--------|----------------------------|---------------------------------------------|-----------------|
| GET    | `/api/classrooms`          | —                                           | List all rooms  |
| POST   | `/api/classrooms`          | `{roomId, capacity, floorNo, nearWashroom}` | Add a room      |
| DELETE | `/api/classrooms/:id`      | —                                           | Remove a room   |
| POST   | `/api/allocation/allocate` | `{ totalStudents: N }`                      | Run allocation  |

---

## Greedy Algorithm

```
sort rooms by floorNo ASC, capacity DESC
if totalCapacity < totalStudents → "Not enough seats available"
else greedily fill rooms until all students seated
Time: O(n log n), Space: O(n)
```

---

## Setup

```bash
npm install && npm run install:all

# backend/.env
MONGO_URI=mongodb://localhost:27017/exam_seat_planner
PORT=5000

# frontend/.env
REACT_APP_API_URL=http://localhost:5000/api

npm run dev
```
