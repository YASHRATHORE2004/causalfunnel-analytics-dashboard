# CausalFunnel Analytics Tracker

## Project Overview

CausalFunnel Analytics Tracker is a full-stack analytics application designed to capture and analyze user interactions across a website. It tracks user sessions and records events in MongoDB Atlas, then exposes aggregated analytics through a clean, responsive Next.js dashboard.

### Key Capabilities

* Page view tracking
* Click tracking
* Session tracking
* Session analytics
* User journey visualization
* Click heatmap visualization

---

# Features

## Core Features

* Page View Tracking
* Click Tracking
* Session Tracking
* Event Storage
* Session Analytics
* Session Timeline
* Heatmap Visualization
* Dashboard Statistics

## Extra Features Added

* Session expiration after inactivity
* Responsive mobile-friendly UI
* Dashboard statistics cards
* Top Pages analytics
* Error handling
* Loading states
* Empty states
* Environment variable support
* MongoDB aggregation pipelines
* Dynamic heatmap navigation from dashboard
* API abstraction layer
* Reusable shared UI components

---

# System Architecture

```text
Browser/User
│
├── tracker.js
│
▼
Node.js + Express Backend
│
├── POST /api/events
├── GET /api/sessions
├── GET /api/sessions/:sessionId
├── GET /api/heatmap
└── GET /api/stats
│
▼
MongoDB Atlas
│
▼
Next.js Dashboard
│
├── Dashboard
├── Sessions View
├── Session Details
└── Heatmap View
```

---

# Project Structure

```text
causalfunnel-analytics-dashboard/
│
├── backend/
├── frontend/
└── README.md
```

### frontend

Contains the Next.js application, UI pages, shared components, and frontend logic.

### backend

Contains the Express server, API routes, controllers, models, and database configuration.

### tracker.js flow

The browser-side tracker script that creates and renews sessions, captures page views and clicks, and sends events to the backend.

### public/

Static assets and the standalone tracker script file used for event collection.

### components/

Reusable React components used across the frontend UI.

### app/

Next.js app router pages and client-side views.

### controllers/

Backend controller functions that handle event ingestion and analytics responses.

### models/

Mongoose schemas defining event structure and database indexes.

### routes/

Express route definitions for API endpoints.

### config/

Database and environment configuration utilities.

---

# Event Tracking Flow

1. User opens a page in the application.
2. The tracker script generates a session ID or reuses an existing session from localStorage.
3. A `page_view` event is sent to the backend.
4. Click events are captured and sent as `click` events.
5. Events are stored in MongoDB Atlas.
6. The dashboard reads aggregated session and heatmap data from the backend APIs.

---

# Database Schema

## Event Schema

```javascript
{
  sessionId,
  eventType,
  pageUrl,
  timestamp,
  clickX,
  clickY
}
```

### Field Explanation

| Field     | Description                                                     |
| --------- | --------------------------------------------------------------- |
| sessionId | Unique identifier for a user session, persisted in localStorage |
| eventType | Type of interaction: page_view or click                         |
| pageUrl   | The URL of the page where the event occurred                    |
| timestamp | ISO timestamp when the event was recorded                       |
| clickX    | Horizontal coordinate of a click event                          |
| clickY    | Vertical coordinate of a click event                            |

---

# API Documentation

## POST /api/events

### Purpose

Ingest analytics events from the browser tracker.

### Request Body

```json
{
  "sessionId": "123",
  "eventType": "click",
  "pageUrl": "/home",
  "timestamp": "2025-06-23T10:00:00Z",
  "clickX": 120,
  "clickY": 340
}
```

### Response

```json
{
  "success": true
}
```

---

## GET /api/sessions

### Purpose

Return aggregated session summaries.

### Response

```json
{
  "sessions": [],
  "total": 0,
  "page": 1,
  "limit": 20
}
```

---

## GET /api/sessions/:sessionId

### Purpose

Retrieve detailed event timeline and metrics for a session.

---

## GET /api/heatmap?pageUrl=

### Purpose

Return aggregated click heatmap data for a page URL.

### Example

```http
GET /api/heatmap?pageUrl=/home
```

---

## GET /api/stats

### Purpose

Provide dashboard statistics and top pages analytics.

---

# Dashboard Pages

## Dashboard Page

Displays:

* Total Events
* Total Sessions
* Total Page Views
* Total Clicks
* Top Pages table
* Direct Heatmap navigation

---

## Sessions Page

Displays:

* Session summary table
* Session ID
* Event count
* Page views
* Clicks
* Duration
* Last Seen timestamp
* Navigation to session details

---

## Session Details Page

Displays:

* Detailed session metadata
* Event counts
* First Seen / Last Seen timestamps
* Complete event timeline
* Click coordinates
* User journey

---

## Heatmap Page

Displays:

* Page URL input
* Heatmap visualization
* Click points table
* Automatic loading via query parameter
* Responsive layout

---

# Session Management

* Session IDs are stored in localStorage.
* Sessions expire after inactivity.
* Expired sessions automatically generate a new session ID.
* Active sessions are renewed on each page view or click.
* Ensures accurate analytics and user journey tracking.

---

# Heatmap Logic

1. Click coordinates are captured for every click event.
2. Backend aggregation groups click events by page URL and coordinates.
3. Dot size scales according to click frequency.
4. Heatmap visualization displays click density using responsive positioning.

---

# Environment Variables

## Frontend

Create:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Backend

Create:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

---

# Local Development Setup

## Backend

Install dependencies:

```bash
npm install
```

Create `.env`

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

Start backend:

```bash
npm run dev
```

---

## Frontend

Install dependencies:

```bash
npm install
```

Create `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

---

# MongoDB Setup

* Use MongoDB Atlas for database storage.
* Add connection string in `MONGODB_URI`.
* Configure network access.
* Create database user credentials.

---

# Design Decisions

* MongoDB chosen for flexible event storage and efficient aggregation.
* Aggregation pipelines power session analytics and dashboard statistics.
* localStorage used for lightweight session persistence.
* Heatmap generated directly from raw click coordinates.
* Frontend uses a dedicated API layer for maintainability.
* Reusable components improve scalability and code organization.

---

# Future Improvements

* Authentication and authorization
* User segmentation
* Advanced heatmap library integration
* Date-range filtering
* Session replay functionality
* CI/CD deployment pipeline
* Advanced analytics reporting

---

# Screenshots

## Dashboard

*Add screenshot here*

## Sessions

*Add screenshot here*

## Session Details

*Add screenshot here*

## Heatmap

*Add screenshot here*

---

# Conclusion

CausalFunnel Analytics Tracker is a full-stack analytics solution for tracking user behavior through page views, clicks, sessions, and heatmap visualization. It combines a lightweight browser tracker, Express.js backend, MongoDB Atlas storage, and a responsive Next.js dashboard to provide actionable user insights.
